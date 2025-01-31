import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // get token from session
  getToken() {
    return localStorage.getItem('token');
  }

  // get user details from db
  getUser(): Observable<any> {
    const token = this.getToken();

    return this.http.get(`${this.apiUrl}/admin/getAllUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
