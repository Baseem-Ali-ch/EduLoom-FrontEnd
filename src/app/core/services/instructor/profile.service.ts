import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/IUser';
import { HttpClient } from '@angular/common/http';

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
  getInstructor(): Observable<any> {
    return this._http.get(`${this._apiUrl}/instructor/getInstructor`, {});
  }

  // update user details
  updateUser(userData: User): Observable<any> {
    return this._http.put(`${this._apiUrl}/instructor/profileUpdate`, userData, {});
  }

  // upload profile photo
  uploadProfilePhoto(formData: FormData): Observable<any> {
    return this._http.post(`${this._apiUrl}/instructor/profile-photo`, formData, {});
  }

  // get full image URL
  getFullImageUrl(photoUrl: string): string {
    if (photoUrl && !photoUrl.startsWith('_http')) {
      return `${this._apiUrl}${photoUrl}`;
    }
    return photoUrl;
  }

  // change password
  changePassword(passwordData: any): Observable<any> {
    return this._http.post(`${this._apiUrl}/instructor/change-password`, passwordData, {});
  }
}
