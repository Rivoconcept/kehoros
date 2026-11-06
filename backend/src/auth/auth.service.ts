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
import { createHmac, randomInt, randomUUID, timingSafeEqual } from 'node:crypto';
import { createTransport } from 'nodemailer';
import { UserService } from '../user/user.service';

import { LoginReq } from './requests/login.req';
import { RegisterReq } from './requests/register.req';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly loginChallenges = new Map<string, {
    userId: string;
    email: string;
    codeHash: string;
    expiresAt: number;
    attempts: number;
    sentAt: number;
  }>();
  private readonly loginCodeLastSent = new Map<string, number>();
  private readonly passwordResetOtpStorage = new Map<string, {
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
    await this.userService.create({
      email,
      password_hash,
      first_name: dto.first_name,
      last_name: dto.last_name,
      manager_id: dto.manager_id,
      department_id: dto.department_id,
    });
    
    return { message: 'Compte créé. Connectez-vous pour vérifier votre adresse e-mail.' };
  }

  async login(dto: LoginReq) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (!user.is_active) throw new UnauthorizedException('Account disabled');

    if (!user.two_factor_enabled) {
      return this.signToken(user);
    }

    this.clearExpiredLoginChallenges();
    const lastSentAt = this.loginCodeLastSent.get(email);
    if (lastSentAt && Date.now() - lastSentAt < 60_000) {
      throw new HttpException(
        'Veuillez attendre une minute avant de demander un nouveau code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = randomInt(100_000, 1_000_000).toString();
    const challengeId = randomUUID();
    const sentAt = Date.now();
    this.loginChallenges.set(challengeId, {
      userId: user.id,
      email,
      codeHash: this.hashOtp(email, code),
      expiresAt: sentAt + 10 * 60_000,
      attempts: 0,
      sentAt,
    });
    this.loginCodeLastSent.set(email, sentAt);

    try {
      await this.sendEmailCode(
        email,
        code,
        'Votre code de connexion Kehoros',
        'Votre code de connexion',
        'Failed to send email login code',
      );
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        return {
          challengeId,
          emailCodeSent: false,
          message: 'Le code e-mail n’a pas pu être envoyé. Utilisez votre code de secours.',
        };
      }
      this.loginChallenges.delete(challengeId);
      this.loginCodeLastSent.delete(email);
      throw error;
    }

    return {
      challengeId,
      emailCodeSent: true,
      message: 'Un code de vérification a été envoyé par e-mail.',
    };
  }

  async resendLoginCode(challengeId: string) {
    const challenge = this.loginChallenges.get(challengeId);
    if (!challenge || Date.now() > challenge.expiresAt) {
      this.loginChallenges.delete(challengeId);
      throw new BadRequestException('La demande de connexion a expiré. Recommencez.');
    }

    if (Date.now() - challenge.sentAt < 60_000) {
      throw new HttpException(
        'Veuillez attendre une minute avant de demander un nouveau code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = randomInt(100_000, 1_000_000).toString();
    const sentAt = Date.now();
    challenge.sentAt = sentAt;
    this.loginCodeLastSent.set(challenge.email, challenge.sentAt);
    await this.sendEmailCode(
      challenge.email,
      code,
      'Votre code de connexion Kehoros',
      'Votre code de connexion',
      'Failed to resend email login code',
    );
    challenge.codeHash = this.hashOtp(challenge.email, code);

    return { message: 'Un nouveau code de vérification a été envoyé.' };
  }

  async verifyLogin(challengeId: string, code: string, method: 'email' | 'recovery') {
    const challenge = this.loginChallenges.get(challengeId);
    if (!challenge) {
      throw new BadRequestException('La demande de connexion est introuvable. Recommencez.');
    }

    if (Date.now() > challenge.expiresAt) {
      this.loginChallenges.delete(challengeId);
      throw new BadRequestException('Le code a expiré. Recommencez la connexion.');
    }

    let validCode = false;
    if (method === 'email' && /^\d{6}$/.test(code)) {
      const providedHash = Buffer.from(this.hashOtp(challenge.email, code), 'hex');
      const expectedHash = Buffer.from(challenge.codeHash, 'hex');
      validCode = timingSafeEqual(providedHash, expectedHash);
    } else if (method === 'recovery') {
      validCode = await this.userService.consumeRecoveryCode(challenge.userId, code);
    }

    if (!validCode) {
      challenge.attempts += 1;
      if (challenge.attempts >= 5) {
        this.loginChallenges.delete(challengeId);
        throw new UnauthorizedException('Trop de tentatives. Recommencez la connexion.');
      }
      throw new UnauthorizedException('Code de validation incorrect.');
    }

    this.loginChallenges.delete(challengeId);
    const user = await this.userService.findByEmail(challenge.email);
    if (!user || !user.is_active || user.id !== challenge.userId) {
      throw new UnauthorizedException('Le compte est introuvable ou désactivé.');
    }

    return this.signToken(user);
  }

  async requestPasswordReset(rawEmail: string) {
    const email = rawEmail.trim().toLowerCase();
    const user = await this.userService.findByEmail(email);
    if (!user || !user.is_active) {
      return { message: 'Si un compte actif est associé à cette adresse, un code sera envoyé.' };
    }

    const previous = this.passwordResetOtpStorage.get(email);
    if (previous && Date.now() - previous.sentAt < 60_000) {
      throw new HttpException(
        'Veuillez attendre une minute avant de demander un nouveau code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = randomInt(100_000, 1_000_000).toString();
    const codeHash = this.hashOtp(email, code);
    await this.sendEmailCode(
      email,
      code,
      'Réinitialisation de votre mot de passe Kehoros',
      'Votre code de réinitialisation',
      'Failed to send password reset code',
    );

    this.passwordResetOtpStorage.set(email, {
      codeHash,
      expiresAt: Date.now() + 10 * 60_000,
      attempts: 0,
      sentAt: Date.now(),
    });

    return { message: 'Si un compte actif est associé à cette adresse, un code sera envoyé.' };
  }

  async resetPassword(rawEmail: string, code: string, newPassword: string) {
    const email = rawEmail.trim().toLowerCase();
    const record = this.passwordResetOtpStorage.get(email);

    if (!record) {
      throw new BadRequestException('Aucun code valide pour cet e-mail. Demandez un nouveau code.');
    }

    if (Date.now() > record.expiresAt) {
      this.passwordResetOtpStorage.delete(email);
      throw new BadRequestException('Le code a expiré. Demandez un nouveau code.');
    }

    const providedHash = Buffer.from(this.hashOtp(email, code), 'hex');
    const expectedHash = Buffer.from(record.codeHash, 'hex');
    if (!timingSafeEqual(providedHash, expectedHash)) {
      record.attempts += 1;
      if (record.attempts >= 5) {
        this.passwordResetOtpStorage.delete(email);
      }
      throw new UnauthorizedException('Code de validation incorrect.');
    }

    const user = await this.userService.findByEmail(email);
    if (!user || !user.is_active) {
      this.passwordResetOtpStorage.delete(email);
      throw new UnauthorizedException('Code de validation incorrect.');
    }

    await this.userService.updatePassword(user.id, await bcrypt.hash(newPassword, 10));
    this.passwordResetOtpStorage.delete(email);

    return { message: 'Votre mot de passe a été modifié.' };
  }

  private async sendEmailCode(
    email: string,
    code: string,
    subject: string,
    codeLabel: string,
    errorLabel: string,
  ): Promise<void> {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT);
    const username = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM || username;
    if (!host || !Number.isInteger(port) || !username || !password || !from) {
      throw new ServiceUnavailableException('Le service d’envoi d’e-mails n’est pas configuré.');
    }

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
        subject,
        text: `${codeLabel} est ${code}. Il expire dans 10 minutes.`,
        html: `<p>${codeLabel} Kehoros est :</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</p><p>Il expire dans 10 minutes. Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.</p>`,
      });
    } catch (error) {
      this.logger.error(`${errorLabel}: ${error instanceof Error ? error.message : String(error)}`);
      throw new ServiceUnavailableException('Impossible d’envoyer l’e-mail de vérification. Réessayez plus tard.');
    }
  }

  private clearExpiredLoginChallenges(): void {
    const now = Date.now();
    for (const [challengeId, challenge] of this.loginChallenges) {
      if (challenge.expiresAt <= now) {
        this.loginChallenges.delete(challengeId);
      }
    }
    for (const [email, sentAt] of this.loginCodeLastSent) {
      if (now - sentAt >= 60_000) {
        this.loginCodeLastSent.delete(email);
      }
    }
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