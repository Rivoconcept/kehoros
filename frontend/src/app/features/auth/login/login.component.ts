import { Component } from '@angular/core';
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
  standalone: true,
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
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  // Champs
  email    = '';
  password = '';
  code = '';
  rememberMe = false;

  // UI state
  loading      = false;
  error        = '';
  otpRequested = false;
  accountNotFound = false;
  usePassword = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {}

  onSubmit() {
    if (!this.usePassword) {
      this.requestEmailCode();
      return;
    }

    this.error = '';
    this.accountNotFound = false;

    if (!this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }

    this.loading = true;

    this.authService.login({
      email:    this.email,
      password: this.password,
    }).subscribe({
      next: async () => {
        this.loading = false;

        const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ?? undefined;
        const ok = await this.authService.redirectByRole(returnUrl);

        if (!ok) {
          this.error = 'Impossible d’accéder à la page demandée.';
        }
      },
      error: (err) => {
        this.error = this.getErrorMessage(err, 'Email ou mot de passe incorrect.');
        this.loading = false;
      },
    });
  }

  requestEmailCode() {
    this.error = '';
    this.accountNotFound = false;
    if (!this.email.trim()) {
      this.error = 'Veuillez saisir votre adresse e-mail.';
      return;
    }

    this.loading = true;
    this.authService.requestEmailCode(this.email.trim()).subscribe({
      next: (response) => {
        if (!response.accountExists) {
          this.accountNotFound = true;
          this.loading = false;
          return;
        }
        this.otpRequested = true;
        this.code = '';
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.status === 404
          ? 'Le service de connexion par e-mail n’est pas à jour. Redémarrez le backend, puis réessayez.'
          : this.getErrorMessage(err, 'Impossible d’envoyer le code. Réessayez plus tard.');
        this.loading = false;
      },
    });
  }

  verifyEmailCode() {
    this.error = '';
    if (!/^\d{6}$/.test(this.code)) {
      this.error = 'Veuillez saisir le code à 6 chiffres reçu par e-mail.';
      return;
    }

    this.loading = true;
    this.authService.loginWithEmailCode(this.email.trim(), this.code).subscribe({
      next: async () => {
        this.loading = false;
        const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ?? undefined;
        const ok = await this.authService.redirectByRole(returnUrl);
        if (!ok) {
          this.error = 'Impossible d’accéder à la page demandée.';
        }
      },
      error: (err) => {
        this.error = this.getErrorMessage(err, 'Le code est incorrect ou expiré.');
        this.loading = false;
      },
    });
  }

  changeEmail() {
    this.otpRequested = false;
    this.code = '';
    this.error = '';
  }

  toggleAuthMode() {
    this.usePassword = !this.usePassword;
    this.error = '';
    this.accountNotFound = false;
  }

  private getErrorMessage(err: any, fallback: string): string {
    const message = err?.error?.message ?? err?.message;
    return Array.isArray(message) ? message.join(' ') : message ?? fallback;
  }
}