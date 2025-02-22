import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  // Register
  refreshToken(refreshToken: string | null): Observable<any> {
    return this._http.post(`${this._apiUrl}/shared/refresh-token`, { refreshToken });
  }
}
