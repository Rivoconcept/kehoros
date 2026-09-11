// src/app/core/guards/role.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (_route, _state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getRole();

    if (authService.isLoggedIn() && allowedRoles.includes(userRole)) {
      return true;
    }

    // Redirection vers sa page autorisée si l'utilisateur est déjà connecté
    if (authService.isLoggedIn()) {
      if (userRole === 'admin') return router.createUrlTree(['/dashboard']);
      if (userRole === 'manager') return router.createUrlTree(['/forms/templates']);
      return router.createUrlTree(['/forms/assignments']);
    }

    return router.createUrlTree(['/login']);
  };
};