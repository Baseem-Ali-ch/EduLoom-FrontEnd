import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './state/user/user.reducer';
import { provideHttpClient } from '@angular/common/http';
import { AppState } from './state/user/user.state';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore<AppState>({ registration: authReducer }),
    provideHttpClient(),
    importProvidersFrom(SocialLoginModule),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '608019199691-eelbp162ca7ckpck9ukqthqi9jp993k1.apps.googleusercontent.com', { oneTapEnabled: false }
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
};
