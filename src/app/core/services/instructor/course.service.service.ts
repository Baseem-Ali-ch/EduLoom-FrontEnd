import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICourseForm } from '../../models/ICourse';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseServiceService {
  private _apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  createCourse(courseData: any): Observable<any> {
    return this._http.post(`${this._apiUrl}/instructor/create-course`, { courseData });
  }
}
