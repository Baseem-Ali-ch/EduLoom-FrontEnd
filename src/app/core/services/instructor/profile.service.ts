import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/IUser';
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
  getInstructor(): Observable<any> {
    const token = this.getToken();
    return this.http.get(`${this.apiUrl}/instructor/getInstructor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // update user details
  updateUser(userData: User): Observable<any> {
    const token = this.getToken();
    return this.http.put(`${this.apiUrl}/instructor/profileUpdate`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // upload profile photo
  uploadProfilePhoto(formData: FormData): Observable<any> {
    console.log('form data', formData);
    const token = this.getToken();
    return this.http.post(`${this.apiUrl}/instructor/profile-photo`, formData, {
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
}
