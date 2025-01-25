import { Routes } from '@angular/router';
import { RegisterComponent } from './features/user/register/register.component';
import { LoginComponent } from './features/user/login/login.component';
import { DashboardComponent } from './features/user/dashboard/dashboard.component';
import { OtpComponent } from './features/user/otp/otp.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'otp-verify/:email', component: OtpComponent },
  { path: '**', component: NotfoundComponent },
];
