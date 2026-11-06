import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatCheckboxModule,
    ],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './login.component.scss'
})
export class LoginComponent {

  // Champs
  email    = '';
  password = '';
  code = '';
  verificationMethod: 'email' | 'recovery' = 'email';
  rememberMe = false;
  challengeId = '';

  // UI state
  loading      = false;
  error        = '';
  notice       = '';
  emailCodeSent = true;
  otpRequested = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.email = this.activatedRoute.snapshot.queryParamMap.get('email') ?? '';
  }

  onSubmit() {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }

    this.loading = true;

    this.authService.login({
      email:    this.email,
      password: this.password,
    }).subscribe({
      next: async (response) => {
        this.loading = false;
        if ('access_token' in response) {
          const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ?? undefined;
          const ok = await this.authService.redirectByRole(returnUrl);
          if (!ok) {
            this.error = 'Impossible d’accéder à la page demandée.';
          }
          return;
        }

        this.challengeId = response.challengeId;
        this.otpRequested = true;
        this.code = '';
        this.verificationMethod = 'email';
        this.emailCodeSent = response.emailCodeSent;
        this.notice = response.message;
      },
      error: (err) => {
        this.error = this.getErrorMessage(err, 'E-mail ou mot de passe incorrect.');
        this.loading = false;
      },
    });
  }

  verifyCode() {
    this.error = '';
    if (!this.code.trim()) {
      this.error = this.verificationMethod === 'email'
        ? 'Veuillez saisir le code reçu par e-mail.'
        : 'Veuillez saisir votre code de secours.';
      return;
    }

    this.loading = true;
    this.authService.verifyLogin(
      this.challengeId,
      this.code.trim(),
      this.verificationMethod,
    ).subscribe({
      next: async () => {
        this.loading = false;
        const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ?? undefined;
        const ok = await this.authService.redirectByRole(returnUrl);
        if (!ok) {
          this.error = 'Impossible d’accéder à la page demandée.';
        }
      },
      error: (err) => {
        this.error = this.getErrorMessage(err, 'Code incorrect ou expiré.');
        this.loading = false;
      },
    });
  }

  selectVerificationMethod(method: 'email' | 'recovery') {
    this.verificationMethod = method;
    this.code = '';
    this.error = '';
  }

  resendCode() {
    this.error = '';
    this.loading = true;
    this.authService.resendLoginCode(this.challengeId).subscribe({
      next: () => {
        this.loading = false;
        this.code = '';
        this.verificationMethod = 'email';
      },
      error: (err) => {
        this.error = this.getErrorMessage(err, 'Impossible de renvoyer le code.');
        this.loading = false;
      },
    });
  }

  changeEmail() {
    this.otpRequested = false;
    this.code = '';
    this.password = '';
    this.challengeId = '';
    this.error = '';
  }

  private getErrorMessage(err: any, fallback: string): string {
    const message = err?.error?.message ?? err?.message;
    return Array.isArray(message) ? message.join(' ') : message ?? fallback;
  }
}