import { Injectable } from '@angular/core';
import { User } from '../models/IUser';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // get token from session
  getToken() {
    return localStorage.getItem('token');
  }

  // get user details from db
  getUser(): Observable<any> {
    const token = this.getToken();
    return this.http.get(`${this.apiUrl}/user/getUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // update user details
  updateUser(userData: User): Observable<any> {
    const token = this.getToken();
    return this.http.put(`${this.apiUrl}/user/profileUpdate`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // upload profile photo
  uploadProfilePhoto(formData: FormData): Observable<any> {
    console.log('form data', formData);
    const token = this.getToken();
    return this.http.post(`${this.apiUrl}/user/profile-photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }



  // get full image URL
  getFullImageUrl(photoUrl: string): string {
    if (photoUrl && !photoUrl.startsWith('http')) {
      return `${this.apiUrl}${photoUrl}`;
    }
    return photoUrl;
  }

  // send request to become instructor
  becomeInstructor(instructorData: User): Observable<any> {
    const token = this.getToken();
    return this.http.post(`${this.apiUrl}/user/instructor-request`, instructorData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
