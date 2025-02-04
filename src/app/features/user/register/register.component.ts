import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StateObservable, Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/user/auth.service';
import Swal from 'sweetalert2';
import { register } from '../../../state/user/user.action';
import { selectIsLoading } from '../../../state/user/user.selector';
import { AppState } from '../../../state/user/user.state';
import { User } from '../../../core/models/IUser';

declare const google: any;


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private authService: AuthService,
    private router: Router
  ) {
    // select the loading state
    this.store
      .select(selectIsLoading)
      .subscribe((isLoading) => (this.isLoading = isLoading));
  }

  ngOnInit(): void {
    // register form validation
    this.registerForm = this.fb.group(
      {
        userName: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.matchPassword }
    );

    // prevent navigate register page after loggined
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/student/dashboard']);
    }

    this.renderGoogleSignInButton();
  }

  // password match function
  matchPassword(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { misMatch: true };
  }

  // register submit
  onSubmit(): void {
    const { userName, email, password } = this.registerForm.value;
    this.store.dispatch(
      register({ userName: userName, email: email, password: password })
    );
    if (this.registerForm.valid) {
      console.log('registration dispatched : ', this.registerForm.value);
      this.authService.register(this.registerForm.value).subscribe({
        next: (res: Response) => {
          const email = this.registerForm.value.email;
          if (res) {
            localStorage.setItem('email', email);

            // navigate the otp page and send the sate
            this.router.navigate([`/student/otp-verify/${email}`]);

            Swal.fire({
              icon: 'success',
              title: 'OTP Send Successful',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              background: 'rgb(8, 10, 24)',
              color: 'white',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Failed to send OTP',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              background: 'rgb(8, 10, 24)',
              color: 'white',
            });
          }
        },
        error: (error) => {
          console.log('Error during registration', error);
          const errorMessage = error.error?.message || 'Failed to send OTP';
          Swal.fire({
            icon: 'error',
            title: errorMessage,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgb(8, 10, 24)',
            color: 'white',
          });
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  // show and hide password handling
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  renderGoogleSignInButton() {
    if (typeof google === 'undefined') {
      console.error('Google API not loaded');
      return;
    }

    google.accounts.id.initialize({
      client_id:
        '608019199691-eelbp162ca7ckpck9ukqthqi9jp993k1.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-login-btn'),
      {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
      }
    );

    google.accounts.id.prompt();
  }

  handleCredentialResponse(response: any) {
    const idToken = response.credential;

    this.authService.googleLogin({ token: idToken }).subscribe({
      next: (res) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', res.token);
        this.router.navigate(['/student/dashboard']);
        Swal.fire({
          icon: 'success',
          title: 'Google Login Successful!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: 'rgb(8, 10, 24)',
          color: 'white',
        });
      },
      error: (error) => {
        console.error('Google login error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Google Login Failed',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: 'rgb(8, 10, 24)',
          color: 'white',
        });
      },
    });
  }
}
