import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private _apiUrl = 'http://localhost:3001';
  
    constructor(private _http: HttpClient) {}
  
    // get token from session
    getToken() {
      return localStorage.getItem('token');
    }
  
    // get user details from db
    getInstructor(): Observable<any> {
      const token = this.getToken();
  
      return this._http.get(`${this._apiUrl}/admin/getAllInstructor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // update status 
    updateInstructorStatus(id: string, status: boolean): Observable<any> {
    return this._http.patch(`${this._apiUrl}/admin/changeStatusIns/status`, {id, status})
  }
}
