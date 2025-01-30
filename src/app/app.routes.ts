import { Routes } from '@angular/router';
import { RegisterComponent } from './features/user/register/register.component';
import { LoginComponent } from './features/user/login/login.component';
import { DashboardComponent } from './features/user/dashboard/dashboard.component';
import { OtpComponent } from './features/user/otp/otp.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/user/profile/profile.component';
import { UserComponent } from './features/user/user/user.component';

export const routes: Routes = [
  { path: '', redirectTo: '/user/login', pathMatch: 'full' },
  {
    path: 'user',
    component: UserComponent, // Assuming you have a UserComponent to act as a layout
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      { path: 'otp-verify/:email', component: OtpComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect to login by default
    ],
  },

  { path: '**', component: NotfoundComponent }, // Catch-all for 404
];
