import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  menuItems: MenuItem[] = [
    { icon: 'dashboard',   label: 'Tableau de bord', route: '/dashboard' },
    { icon: 'description', label: 'Formulaires',     route: '/forms' },
    { icon: 'computer',    label: 'Matériels',        route: '/assets' },
    { icon: 'people',      label: 'Utilisateurs',     route: '/users' },
    { icon: 'key',         label: 'Licences',         route: '/licenses' },
  ];

  stats = [
    { icon: 'computer',    label: 'Matériels',           value: 0, color: '#4299e1' },
    { icon: 'people',      label: 'Collaborateurs',       value: 0, color: '#48bb78' },
    { icon: 'key',         label: 'Licences actives',     value: 0, color: '#ed8936' },
    { icon: 'description', label: 'Formulaires publiés',  value: 0, color: '#9f7aea' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  logout() {
    this.authService.logout();
  }
}