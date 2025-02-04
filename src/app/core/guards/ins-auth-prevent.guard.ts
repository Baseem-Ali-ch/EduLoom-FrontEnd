import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/instructor/auth.service';

export const insAuthPreventGuard: CanActivateFn = (route, state) => {
const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    router.navigate(['/instructor/dashboard']);
    return false;
  }
  return true;};
