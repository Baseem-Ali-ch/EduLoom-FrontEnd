import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/services/user/notification.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { Observable } from 'rxjs';
import { selectLoginDetails } from '../../../state/user/user.selector';
import { Store } from '@ngrx/store';
import { User } from '../../../core/models/IUser';
import { AppState } from '../../../state/user/user.state';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [SidebarComponent, CommonModule, NotificationModalComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  isModalOpen: boolean = false;
  notificationData: any;
  userId: string = '';
  token!: string | null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchNotification();
  }

  // fetch all notification
  fetchNotification() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      // Decode the token to get userId
      const decodedToken: any = jwtDecode(this.token);
      const userId = decodedToken.id;

      this.notificationService.getNotification().subscribe((data) => {
        this.notifications = data.filter(
          (notification) => notification.userId === userId
        );
      });
    } else {
      console.error('No token found in session storage');
      this.notifications = [];
    }
  }

  openModal(notifacation: any) {
    this.notificationData = notifacation;
    this.isModalOpen = true;
  }

  // close modal
  closeModal() {
    this.isModalOpen = false;
    this.notificationData = null;
  }
}
