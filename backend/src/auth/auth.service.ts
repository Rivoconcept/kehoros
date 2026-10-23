import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { createTransport } from 'nodemailer';
import { UserService } from '../user/user.service';

import { LoginReq } from './requests/login.req';
import { RegisterReq } from './requests/register.req';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly otpStorage = new Map<string, {
    codeHash: string;
    expiresAt: number;
    attempts: number;
    sentAt: number;
  }>();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterReq) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new ConflictException('Email already used');

    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      email,
      password_hash,
      first_name: dto.first_name,
      last_name: dto.last_name,
      manager_id: dto.manager_id,
      department_id: dto.department_id,
    });
    
    return this.signToken(user);
  }

  async login(dto: LoginReq) {
    const user = await this.userService.findByEmail(dto.email.trim().toLowerCase());
    if (!user) throw new UnauthorizedException('Invalid credentials');

    console.log('User found, comparing password...');
    
    try {
      const valid = await bcrypt.compare(dto.password, user.password_hash);
      console.log('Password valid:', valid);
      if (!valid) throw new UnauthorizedException('Invalid credentials');
    } catch (err) {
      console.error('bcrypt error:', err);
      throw err;
    }

    if (!user.is_active) throw new UnauthorizedException('Account disabled');

    return this.signToken(user);
  }

  async requestEmailCode(rawEmail: string) {
    const email = rawEmail.trim().toLowerCase();
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return { accountExists: false };
    }
    if (!user.is_active) {
      throw new UnauthorizedException('Ce compte est désactivé. Contactez un administrateur.');
    }

    const previous = this.otpStorage.get(email);
    if (previous && Date.now() - previous.sentAt < 60_000) {
      throw new HttpException(
        'Veuillez attendre une minute avant de demander un nouveau code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT);
    const username = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM || username;
    if (!host || !Number.isInteger(port) || !username || !password || !from) {
      throw new ServiceUnavailableException('Le service d’envoi d’e-mails n’est pas configuré.');
    }

    const code = randomInt(100_000, 1_000_000).toString();
    const codeHash = this.hashOtp(email, code);
    try {
      const transporter = createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE === 'true' || port === 465,
        auth: { user: username, pass: password },
      });
      await transporter.sendMail({
        from,
        to: email,
        subject: 'Votre code de connexion Kehoros',
        text: `Votre code de connexion est ${code}. Il expire dans 10 minutes.`,
        html: `<p>Votre code de connexion Kehoros est :</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</p><p>Il expire dans 10 minutes. Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.</p>`,
      });
    } catch (error) {
      this.logger.error(`Failed to send email login code: ${error instanceof Error ? error.message : String(error)}`);
      throw new ServiceUnavailableException('Impossible d’envoyer l’e-mail de vérification. Réessayez plus tard.');
    }

    this.otpStorage.set(email, {
      codeHash,
      expiresAt: Date.now() + 10 * 60_000,
      attempts: 0,
      sentAt: Date.now(),
    });

    return { accountExists: true, message: 'Code de vérification envoyé par e-mail.' };
  }

  async verifyEmailCode(rawEmail: string, code: string) {
    const email = rawEmail.trim().toLowerCase();
    const record = this.otpStorage.get(email);

    if (!record) {
      throw new BadRequestException('Aucun code valide pour cet e-mail. Demandez un nouveau code.');
    }

    if (Date.now() > record.expiresAt) {
      this.otpStorage.delete(email);
      throw new BadRequestException('Le code a expiré. Demandez un nouveau code.');
    }

    const providedHash = Buffer.from(this.hashOtp(email, code), 'hex');
    const expectedHash = Buffer.from(record.codeHash, 'hex');
    if (!timingSafeEqual(providedHash, expectedHash)) {
      record.attempts += 1;
      if (record.attempts >= 5) {
        this.otpStorage.delete(email);
      }
      throw new UnauthorizedException('Code de validation incorrect.');
    }

    this.otpStorage.delete(email);

    const user = await this.userService.findByEmail(email);
    if (!user || !user.is_active) {
      throw new UnauthorizedException('Ce compte est introuvable ou désactivé.');
    }

    return this.signToken(user);
  }

  private hashOtp(email: string, code: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ServiceUnavailableException('Le service de connexion n’est pas configuré.');
    }
    return createHmac('sha256', secret).update(`${email}:${code}`).digest('hex');
  }

  private signToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    };
  }
}