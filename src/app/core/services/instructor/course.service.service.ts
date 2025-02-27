import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICourse } from '../../models/ICourse';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseServiceService {
  private _apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  createCourse(formData: FormData): Observable<any> {
    console.log('Sending FormData to backend:');
    for (let [key, value] of (formData as any).entries()) {
      console.log(`${key}:`, value);
    }
    return this._http.post(`${this._apiUrl}/instructor/create-course`, formData);
  }

  getCourses(): Observable<any> {
    return this._http.get<ICourse[]>(`${this._apiUrl}/instructor/get-courses`);
  }

  getDocSignedUrl(courseId: string): Observable<any> {
    return this._http.get(`${this._apiUrl}/instructor/get-doc`, { params: { courseId } });
  }
}
