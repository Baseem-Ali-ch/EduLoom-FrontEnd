import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: boolean = false;

  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // reigster
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/register`, { user });
  }

  // verify otp
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/verify-otp`, { email, otp });
  }

  // login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, { email, password });
  }

  isLoggedIn(): boolean {
    return this.loggedIn || localStorage.getItem('isLoggedIn') === 'true';
  }
}
