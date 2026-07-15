import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      RouterLink,

      MatInputModule,
      MatButtonModule,
      MatCardModule,
      MatFormFieldModule,
      MatIconModule
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  first_name = '';
  last_name = '';
  email = '';
  password = '';
  confirmPassword = '';

  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = '';

    if (
      !this.first_name ||
      !this.last_name ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;

    this.authService
      .register({
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error =
            err?.error?.message ??
            err?.message ??
            "Une erreur est survenue.";

          this.loading = false;
        },
      });
  }
}

/*import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Créer un compte</h2>
        <p class="subtitle">Kehoros — Gestion d'inventaire IT</p>

        <form (ngSubmit)="onSubmit()">
          <div class="row">
            <div class="field">
              <label>Prénom</label>
              <input type="text" [(ngModel)]="first_name" name="first_name" placeholder="Rivo" required />
            </div>
            <div class="field">
              <label>Nom</label>
              <input type="text" [(ngModel)]="last_name" name="last_name" placeholder="Dev" required />
            </div>
          </div>

          <div class="field">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="votre@email.mg" required />
          </div>

          <div class="field">
            <label>Mot de passe</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required />
          </div>

          @if (error) {
            <div class="error">{{ error }}</div>
          }

          <button type="submit" [disabled]="loading">
            {{ loading ? 'Création...' : 'Créer mon compte' }}
          </button>
        </form>

        <p class="link">
          Déjà un compte ?
          <a routerLink="/login">Se connecter</a>
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
      max-width: 420px;
    }
    h2 { margin: 0 0 4px; color: #1a202c; }
    .subtitle { color: #718096; margin: 0 0 2rem; font-size: 0.9rem; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
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
export class RegisterComponent {
  email = '';
  password = '';
  first_name = '';
  last_name = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password || !this.first_name || !this.last_name) return;
    this.loading = true;
    this.error = '';

    this.authService.register({
      email: this.email,
      password: this.password,
      first_name: this.first_name,
      last_name: this.last_name,
    }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Une erreur est survenue';
        this.loading = false;
      },
    });
  }
}*/