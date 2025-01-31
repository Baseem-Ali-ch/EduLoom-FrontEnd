import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private apiUrl = 'http://localhost:3001';
  
    constructor(private http: HttpClient) {}
  
    // get token from session
    getToken() {
      return localStorage.getItem('token');
    }
  
    // get user details from db
    getInstructor(): Observable<any> {
      const token = this.getToken();
  
      return this.http.get(`${this.apiUrl}/admin/getAllInstructor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
}
