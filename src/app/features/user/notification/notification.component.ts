import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';

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
  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchNotification();
  }

  // fetch all notification
  fetchNotification() {
    this.notificationService.getNotification().subscribe((data) => {
      this.notifications = data;
      console.log('notifaicationd,', data);
    });
  }

  openModal(notifacation: any) {
    this.notificationData = notifacation;
    this.isModalOpen = true;
  }

  // close modal
  closeModal() {
    this.isModalOpen = false;
    this.notificationData = null
  }
}
