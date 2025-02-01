import { Routes } from '@angular/router';
import { RegisterComponent } from './features/user/register/register.component';
import { LoginComponent } from './features/user/login/login.component';
import { OtpComponent } from './features/user/otp/otp.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { authGuard } from './core/guards/auth.guard';
import { UserComponent } from './features/user/user/user.component';

export const routes: Routes = [
  { path: '', redirectTo: '/user/login', pathMatch: 'full' },
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'otp-verify/:email', component: OtpComponent },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/user/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/user/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
      {
        path: 'notification',
        loadComponent: () =>
          import('./features/user/notification/notification.component').then(
            (c) => c.NotificationComponent
          ),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  { path: 'admin', redirectTo: '/admin/login', pathMatch: 'full' },

  // admin routes
  {
    path: 'admin',
    component: UserComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/admin/login/login.component').then(
            (c) => c.AdminLoginComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'notification',
        loadComponent: () =>
          import('./features/admin/notification/notification.component').then(
            (c) => c.NotificationComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/admin/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./features/admin/user-manage/user-manage.component').then(
            (c) => c.UserManageComponent
          ),
      },
      {
        path: 'instructors',
        loadComponent: () =>
          import('./features/admin/instructor-manage/instructor-manage.component').then(
            (c) => c.InstructorManageComponent
          ),
      },
    ],
  },

  { path: '**', component: NotfoundComponent },
];
