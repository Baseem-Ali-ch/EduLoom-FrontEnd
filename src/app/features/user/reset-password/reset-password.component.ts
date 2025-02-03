import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/user/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  token: string | null = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.passwordForm = this.fb.group(
      {
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

    this.token = this.route.snapshot.paramMap.get('token');
  }

  // password match function
  matchPassword(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { misMatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('password')?.value;
      this.authService.resetPassword(newPassword, this.token).subscribe({
        next: (response) => {
          console.log('reset password successful', response);
        },
        error: (error) => {
          console.log('failed to reset password', error);
        },
      });
    }
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
