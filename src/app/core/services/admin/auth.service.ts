import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: boolean = false;

  constructor(private _http: HttpClient) {}

  private _apiUrl = 'http://localhost:3001';

  // login
  login(email: string, password: string): Observable<any> {
    return this._http.post(`${this._apiUrl}/admin/login`, { email, password });
  }

  // get token from session
  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.loggedIn || localStorage.getItem('isLoggedIn') === 'true';
  }
}
