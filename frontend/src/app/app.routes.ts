import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Public
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },

  // Admin + Manager uniquement
  {
    path: 'dashboard',
    canActivate: [roleGuard(['admin', 'manager'])],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },

  // Tous les utilisateurs connectés
  {
    path: 'my-forms',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/forms/forms-list/my-forms.component').then(m => m.MyFormsComponent),
  },
  {
    path: 'users',
    canActivate: [roleGuard(['admin', 'manager'])],
    loadComponent: () =>
      import('./features/users/users-list/users-list.component')
        .then(m => m.UsersListComponent),
  },
  { path: '**', redirectTo: '/login' },
];