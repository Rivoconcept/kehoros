import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  code = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  error = '';
  completed = false;
  showPassword = false;
  showConfirmation = false;

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  onSubmit(): void {
    this.error = '';
    if (!this.email.trim() || !/^\d{6}$/.test(this.code)) {
      this.error = 'Saisissez une adresse e-mail et le code à 6 chiffres reçu.';
      return;
    }
    if (this.newPassword.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;
    this.authService.resetPassword(this.email.trim(), this.code, this.newPassword).subscribe({
      next: () => {
        this.completed = true;
        this.loading = false;
      },
      error: (err) => {
        const message = err?.error?.message ?? err?.message;
        this.error = Array.isArray(message)
          ? message.join(' ')
          : message ?? 'Impossible de modifier le mot de passe. Réessayez.';
        this.loading = false;
      },
    });
  }
}
