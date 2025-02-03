import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: boolean = false;
  private userSubject = new BehaviorSubject<any>(null);

  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // reigster
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/register`, { user });
  }

  // verify otp
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/verify-otp`, { email, otp });
  }

  // resend otp
  resendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/resend-otp`, { email });
  }

  // login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/login`, { email, password });
  }

  // get token from session
  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.loggedIn || localStorage.getItem('isLoggedIn') === 'true';
  }
}
