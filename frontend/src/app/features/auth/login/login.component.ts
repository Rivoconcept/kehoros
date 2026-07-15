import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Connexion</h2>
        <p class="subtitle">Kehoros — Gestion d'inventaire IT</p>

        <form (ngSubmit)="onSubmit()">
          <div class="field">
            <label>Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="votre@email.mg"
              required
            />
          </div>

          <div class="field">
            <label>Mot de passe</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          @if (error) {
            <div class="error">{{ error }}</div>
          }

          <button type="submit" [disabled]="loading">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <p class="link">
          Pas encore de compte ?
          <a routerLink="/register">S'inscrire</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f4f8;
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      width: 100%;
      max-width: 400px;
    }
    h2 { margin: 0 0 4px; color: #1a202c; }
    .subtitle { color: #718096; margin: 0 0 2rem; font-size: 0.9rem; }
    .field { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 4px; font-size: 0.875rem; color: #4a5568; }
    input {
      width: 100%; padding: 0.6rem 0.8rem;
      border: 1px solid #e2e8f0; border-radius: 8px;
      font-size: 1rem; box-sizing: border-box;
      outline: none; transition: border-color 0.2s;
    }
    input:focus { border-color: #4299e1; }
    button {
      width: 100%; padding: 0.75rem;
      background: #4299e1; color: white;
      border: none; border-radius: 8px;
      font-size: 1rem; cursor: pointer;
      margin-top: 0.5rem; transition: background 0.2s;
    }
    button:hover:not(:disabled) { background: #3182ce; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .error {
      background: #fff5f5; color: #c53030;
      padding: 0.6rem 0.8rem; border-radius: 8px;
      font-size: 0.875rem; margin-bottom: 0.75rem;
    }
    .link { text-align: center; margin-top: 1rem; font-size: 0.875rem; color: #718096; }
    .link a { color: #4299e1; text-decoration: none; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.error?.message || 'Email ou mot de passe incorrect';
        this.loading = false;
      },
    });
  }
}