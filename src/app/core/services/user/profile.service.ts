import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IInstructor } from '../../models/Instructor';
import { IUser } from '../../models/IUser';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  // get user details from db
  getUser(): Observable<any> {
    return this._http.get(`${this._apiUrl}/student/getUser`);
  }

  getImage(): Observable<any> {
    return this._http.get(`${this._apiUrl}/student/getImage`);
  }

  // update user details
  updateUser(userData: IUser): Observable<any> {
    return this._http.put(`${this._apiUrl}/student/profileUpdate`, userData);
  }

  // upload profile photo
  uploadProfilePhoto(formData: FormData): Observable<any> {
    console.log('form data', formData);
    return this._http.post(`${this._apiUrl}/student/profile-photo`, formData);
  }

  getFullImageUrl(photoUrl: string | undefined): string {
    if (!photoUrl) {
      return 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg';
    }
    return photoUrl.startsWith('http') ? photoUrl : `${this._apiUrl}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
  }

  // send request to become instructor
  becomeInstructor(instructorData: IInstructor, id: string): Observable<any> {
    const requestBody = { ...instructorData, id };
    return this._http.post(`${this._apiUrl}/student/instructor-request`, requestBody);
  }

  // change password
  changePassword(passwordData: any): Observable<any> {
    return this._http.post(`${this._apiUrl}/student/change-password`, passwordData);
  }
}
