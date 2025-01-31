import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/user/auth.service';
import { registerSuccess } from '../../../state/user/user.action';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css',
})
export class OtpComponent implements OnInit {
  otpForm!: FormGroup;
  email!: string | null;
  isExpired: boolean = false;
  timer: any;
  remainingTime = 60;
  token!: string;
  user: any;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.startTimer();

    // retrive the email in params
    this.route.params.subscribe((params) => {
      this.email = params['email'];
    });

    // prevent navigate otp page after loggined
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/user/dashboard']);
    }
  }

  // verify otp handling
  verifyOTP(): void {
    if (this.otpForm.valid && this.email) {
      const { otp } = this.otpForm.value;
      this.authService.verifyOtp(this.email, otp).subscribe({
        next: (res: any) => {
          if (res) {
            localStorage.setItem('isLoggedIn', 'true');
            this.router.navigate(['/user/dashboard']);
            Swal.fire({
              icon: 'success',
              title: res.message || 'Registration Successfull!',
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
              title: 'Registration failed',
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
          const errorMessage = error.error?.message || 'Registration Failed';
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
      console.log('no find email');
      this.otpForm.markAllAsTouched();
    }
  }

  // resend otp function handling
  resendOTP(): void {}

  // timer handling function
  startTimer(): void {
    this.isExpired = false;
    this.remainingTime = 60;
    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.isExpired = true;
        clearInterval(this.timer);
      }
    }, 1000);
  }
}
