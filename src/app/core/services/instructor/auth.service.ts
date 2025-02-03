import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstructorRequest } from '../../models/Instructor';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: boolean = false;

  
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // reigster
  register(instructor:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/instructor/register`, { instructor });
  }

  // login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/instructor/login`, { email, password });
  }

  // get token from session
  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.loggedIn || localStorage.getItem('isLoggedIn') === 'true';
  }
}
