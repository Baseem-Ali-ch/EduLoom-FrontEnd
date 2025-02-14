// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { InstructorRequest } from '../../models/Instructor';
// import { User } from '../../models/IUser';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProfileService {
//   private _apiUrl = 'http://localhost:3001';

//   constructor(private _http: HttpClient) {}

//   // get token from session
//   getToken() {
//     return localStorage.getItem('token');
//   }

//   // get user details from db
//   getUser(): Observable<any> {
//     const token = this.getToken();
//     return this._http.get(`${this._apiUrl}/student/getUser`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }

//   // update user details
//   updateUser(userData: User): Observable<any> {
//     const token = this.getToken();
//     return this._http.put(`${this._apiUrl}/student/profileUpdate`, userData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }

//   // upload profile photo
//   uploadProfilePhoto(formData: FormData): Observable<any> {
//     console.log('form data', formData);
//     const token = this.getToken();
//     return this._http.post(`${this._apiUrl}/student/profile-photo`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }

//   // get full image URL
//   getFullImageUrl(photoUrl: string): string {
//     if (photoUrl && !photoUrl.startsWith('http')) {
//       return `${this._apiUrl}${photoUrl}`;
//     }
//     return photoUrl;
//   }

//   // send request to become instructor
//   becomeInstructor(
//     instructorData: InstructorRequest,
//     id: string
//   ): Observable<any> {
//     const token = this.getToken();
//     const requestBody = { ...instructorData, id };

//     return this._http.post(
//       `${this._apiUrl}/student/instructor-request`,
//       requestBody,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//   }

//   // change password
//   changePassword(passwordData: any): Observable<any> {
//     const token = this.getToken();
//     return this._http.post(
//       `${this._apiUrl}/student/change-password`,
//       passwordData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InstructorRequest } from '../../models/Instructor';
import { User } from '../../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _apiUrl = 'http://localhost:3001';

  constructor(private _http: HttpClient) {}

  // get user details from db
  getUser(): Observable<any> {
    return this._http.get(`${this._apiUrl}/student/getUser`);
  }

  // update user details
  updateUser(userData: User): Observable<any> {
    return this._http.put(`${this._apiUrl}/student/profileUpdate`, userData);
  }

  // upload profile photo
  uploadProfilePhoto(formData: FormData): Observable<any> {
    console.log('form data', formData);
    return this._http.post(`${this._apiUrl}/student/profile-photo`, formData);
  }

  // get full image URL
  // getFullImageUrl(photoUrl: string): string {
  //   if (photoUrl && !photoUrl.startsWith('http')) {
  //     return `${this._apiUrl}${photoUrl}`;
  //   }
  //   return photoUrl;
  // }
  getFullImageUrl(photoUrl: string | undefined): string {
    if (!photoUrl) {
      return 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg';
    }
    return photoUrl.startsWith('http') ? photoUrl : `${this._apiUrl}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
}


  // send request to become instructor
  becomeInstructor(instructorData: InstructorRequest, id: string): Observable<any> {
    const requestBody = { ...instructorData, id };
    return this._http.post(`${this._apiUrl}/student/instructor-request`, requestBody);
  }

  // change password
  changePassword(passwordData: any): Observable<any> {
    return this._http.post(`${this._apiUrl}/student/change-password`, passwordData);
  }
}
