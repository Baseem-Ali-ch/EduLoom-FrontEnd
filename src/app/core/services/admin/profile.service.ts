import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../models/IUser';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  // get token from session
  getToken() {
    return localStorage.getItem('token');
  }

  // get user details from db
  getUser(): Observable<any> {
    return this._http.get(`${this._apiUrl}/admin/getUser`);
  }

  getImage(): Observable<any> {
    return this._http.get(`${this._apiUrl}/admin/getImage`);
  }

  // update user details
  updateUser(userData: IUser): Observable<any> {
    return this._http.put(`${this._apiUrl}/admin/profileUpdate`, userData);
  }

  // upload profile photo
  uploadProfilePhoto(formData: FormData): Observable<any> {
    console.log('form data', formData);
    return this._http.post(`${this._apiUrl}/admin/profile-photo`, formData);
  }

  // get full image URL
  getFullImageUrl(photoUrl: string | undefined): string {
    if (!photoUrl) {
      return 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg';
    }
    return photoUrl.startsWith('http') ? photoUrl : `${this._apiUrl}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
  }

  // change password
  changePassword(passwordData: any): Observable<any> {
    return this._http.post(`${this._apiUrl}/admin/change-password`, passwordData);
  }
}
