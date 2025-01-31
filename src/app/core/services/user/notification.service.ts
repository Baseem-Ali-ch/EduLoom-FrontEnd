import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // get all notifications
  getNotification(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/notification`);
  }

  // update notification status
  updateNotificationStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/notification/${id}`, { status });
  }

  // send email if status accepted
  sendAcceptanceEmail(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/send-email`, {
      userId,
      message: 'You are accepted!',
    });
  }
}
