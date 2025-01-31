import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from 'express';
import { AuthService } from '../services/user/auth.service';

export const authPreventGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    router.navigate(['/user/dashboard']);
    return false;
  }
  return true;
};
