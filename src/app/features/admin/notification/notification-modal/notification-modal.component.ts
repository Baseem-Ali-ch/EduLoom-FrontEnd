import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationService } from '../../../../core/services/user/notification.service';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-modal.component.html',
  styleUrl: './notification-modal.component.css',
})
export class NotificationModalComponent {
  @Input() isOpen = false;
  @Input() data: any = null;

  @Output() close = new EventEmitter<void>();
  constructor(private notificationService: NotificationService) {}

  // update the notification status
  updateStatus(notification: any, status: string) {
    this.notificationService
      .updateNotificationStatus(notification._id, status)
      .subscribe((updatedNotification) => {
        notification.status = status;

        if (status === 'accepted') {
          this.notificationService
            .sendAcceptanceEmail(notification.userId)
            .subscribe(() => {
              console.log('Email sent successfully');
            });
        }
      });
  }
}
