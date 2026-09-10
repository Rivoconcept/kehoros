import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Public
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },

  // Admin uniquement
  {
    path: 'dashboard',
    canActivate: [roleGuard(['admin'])],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },

  // Admin + Manager
  {
    path: 'users',
    canActivate: [roleGuard(['admin', 'manager'])],
    loadComponent: () =>
      import('./features/users/users-list/users-list.component').then(
        (m) => m.UsersListComponent
      ),
  },
  {
    path: 'forms/templates',
    canActivate: [roleGuard(['admin', 'manager'])],
    loadComponent: () =>
      import('./features/forms/templates/template-list.component').then(
        (m) => m.TemplateListComponent
      ),
  },
  {
    path: 'forms/builder',
    canActivate: [roleGuard(['admin', 'manager'])],
    loadComponent: () =>
      import('./features/forms/builder/components/builder.component').then(
        (m) => m.BuilderComponent
      ),
  },
  {
    path: 'forms/builder/:id',
    canActivate: [roleGuard(['admin', 'manager'])],
    loadComponent: () =>
      import('./features/forms/builder/components/builder.component').then(
        (m) => m.BuilderComponent
      ),
  },
  {
    path: 'forms/assignments',
    canActivate: [roleGuard(['admin', 'manager'])],
    loadComponent: () =>
      import('./features/forms/assignments/assignment.component').then(
        (m) => m.AssignmentComponent
      ),
  },
  {
    path: 'forms/results',
    canActivate: [roleGuard(['admin', 'manager'])],
    loadComponent: () =>
      import('./features/forms/results/results.component').then(
        (m) => m.ResultsComponent
      ),
  },
  {
    path: 'forms/results/:templateId',
    canActivate: [roleGuard(['admin', 'manager'])],
    loadComponent: () =>
      import('./features/forms/results/results.component').then(
        (m) => m.ResultsComponent
      ),
  },

  // Accessible à tout utilisateur authentifié (Role: 'user', 'manager', 'admin')
  {
    path: 'forms/my-assignments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/forms/assignments/assignment.component').then(
        (m) => m.AssignmentComponent
      ),
  },
  {
    path: 'forms/player/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/forms/player/form-player.component').then(
        (m) => m.FormPlayerComponent
      ),
  },

  { path: '**', redirectTo: '/login' },
];