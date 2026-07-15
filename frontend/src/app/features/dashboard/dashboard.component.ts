import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header>
        <h1>Kehoros</h1>
        <button (click)="logout()">Déconnexion</button>
      </header>
      <main>
        <h2>Tableau de bord</h2>
        <div class="cards">
          <div class="card">
            <span class="icon">📋</span>
            <h3>Formulaires</h3>
            <p>Gérer les formulaires</p>
          </div>
          <div class="card">
            <span class="icon">💻</span>
            <h3>Matériels</h3>
            <p>Inventaire matériel</p>
          </div>
          <div class="card">
            <span class="icon">👥</span>
            <h3>Utilisateurs</h3>
            <p>Gérer les comptes</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: #f0f4f8; }
    header {
      background: white; padding: 1rem 2rem;
      display: flex; justify-content: space-between; align-items: center;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    h1 { margin: 0; color: #1a202c; }
    header button {
      background: #e53e3e; color: white;
      border: none; padding: 0.5rem 1rem;
      border-radius: 8px; cursor: pointer;
    }
    main { padding: 2rem; }
    h2 { color: #2d3748; margin-bottom: 1.5rem; }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .card {
      background: white; padding: 1.5rem;
      border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      cursor: pointer; transition: transform 0.2s;
    }
    .card:hover { transform: translateY(-2px); }
    .icon { font-size: 2rem; }
    h3 { margin: 0.5rem 0 0.25rem; color: #2d3748; }
    p { margin: 0; color: #718096; font-size: 0.875rem; }
  `]
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }
}