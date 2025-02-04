import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InstructorRequest } from '../../models/Instructor';
import { User } from '../../models/IUser';

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
    return this.http.get(`${this.apiUrl}/student/getUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // update user details
  updateUser(userData: User): Observable<any> {
    const token = this.getToken();
    return this.http.put(`${this.apiUrl}/student/profileUpdate`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // upload profile photo
  uploadProfilePhoto(formData: FormData): Observable<any> {
    console.log('form data', formData);
    const token = this.getToken();
    return this.http.post(`${this.apiUrl}/student/profile-photo`, formData, {
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
  becomeInstructor(
    instructorData: InstructorRequest,
    id: string
  ): Observable<any> {
    const token = this.getToken();
    const requestBody = { ...instructorData, id };

    return this.http.post(
      `${this.apiUrl}/student/instructor-request`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // change password
  changePassword(passwordData: any): Observable<any> {
    const token = this.getToken();
    return this.http.post(
      `${this.apiUrl}/student/change-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
