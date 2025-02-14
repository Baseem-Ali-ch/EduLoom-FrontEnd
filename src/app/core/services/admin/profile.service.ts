import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _apiUrl = 'http://localhost:3001';

  constructor(private _http: HttpClient) {}

  // get token from session
  getToken() {
    return localStorage.getItem('token');
  }

  // get user details from db
  getUser(): Observable<any> {
    return this._http.get(`${this._apiUrl}/admin/getUser`);
  }

  // update user details
  updateUser(userData: User): Observable<any> {
    return this._http.put(`${this._apiUrl}/admin/profileUpdate`, userData);
  }

  // upload profile photo
  uploadProfilePhoto(formData: FormData): Observable<any> {
    console.log('form data', formData);
    return this._http.post(`${this._apiUrl}/admin/profile-photo`, formData);
  }

  // get full image URL
  getFullImageUrl(photoUrl: string): string {
    if (photoUrl && !photoUrl.startsWith('http')) {
      return `${this._apiUrl}${photoUrl}`;
    }
    return photoUrl;
  }

  // change password
  changePassword(passwordData: any): Observable<any> {
    return this._http.post(`${this._apiUrl}/admin/change-password`, passwordData);
  }
}
