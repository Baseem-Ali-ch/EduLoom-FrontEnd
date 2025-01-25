import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authPreventGuard } from './auth-prevent.guard';

describe('authPreventGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authPreventGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
