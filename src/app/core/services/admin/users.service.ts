import { NumberSymbol } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _apiUrl = 'http://localhost:3001';

  constructor(private _http: HttpClient) {}

  // get token from session
  getToken() {
    return localStorage.getItem('token');
  }

  // get user details from db
  getUser(page: number, limit: number): Observable<any> {
    return this._http.get<any>(`${this._apiUrl}/admin/getAllUser?page=${page}&limit=${limit}`);
  }

  // update status
  updateUserStatus(id: string, status: boolean): Observable<any> {
    return this._http.patch(`${this._apiUrl}/admin/changeStatus/status`, { id, status });
  }
}
