import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { insAuthPreventGuard } from './ins-auth-prevent.guard';

describe('insAuthPreventGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => insAuthPreventGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
