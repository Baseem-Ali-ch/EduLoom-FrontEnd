import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/services/user/notification.service';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notification',
    imports: [NotificationModalComponent, CommonModule, AdminSidebarComponent],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  isModalOpen: boolean = false;
  notificationData: any;
  private _subscription: Subscription = new Subscription();

  constructor(private _notificationService: NotificationService) {}

  // ng on init
  ngOnInit(): void {
    this.fetchNotification();
  }

  // ng on destory
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  // fetch all notification
  fetchNotification() {
    const subscription = this._notificationService.getNotification().subscribe((data) => {
      this.notifications = data;
    });
    this._subscription.add(subscription);
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
