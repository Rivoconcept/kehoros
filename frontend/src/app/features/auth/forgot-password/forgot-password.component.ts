import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  error = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  onSubmit(): void {
    this.error = '';
    const email = this.email.trim();
    if (!email) {
      this.error = 'Veuillez saisir votre adresse e-mail.';
      return;
    }

    this.loading = true;
    this.authService.requestPasswordReset(email).subscribe({
      next: async () => {
        this.loading = false;
        await this.router.navigate(['/reset-password'], { queryParams: { email } });
      },
      error: (err) => {
        const message = err?.error?.message ?? err?.message;
        this.error = Array.isArray(message)
          ? message.join(' ')
          : message ?? 'Impossible de traiter la demande. Réessayez plus tard.';
        this.loading = false;
      },
    });
  }
}
