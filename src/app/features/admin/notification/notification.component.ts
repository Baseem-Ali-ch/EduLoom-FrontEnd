import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/services/user/notification.service';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NotificationModalComponent, CommonModule, AdminSidebarComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  isModalOpen: boolean = false;
  notificationData: any;
  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchNotification();
  }

  // fetch all notification
  fetchNotification() {
    this.notificationService.getNotification().subscribe((data) => {
      this.notifications = data;
    });
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


