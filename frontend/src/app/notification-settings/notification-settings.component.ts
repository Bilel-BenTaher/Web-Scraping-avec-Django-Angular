import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.css']
})
export class NotificationSettingsComponent implements OnInit {
  isSubscribed = false;
  isLoading = false;
  message = '';
  messageType = '';

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getSubscriptionStatus().subscribe(
      status => this.isSubscribed = status
    );
  }

  async toggleNotifications() {
    this.isLoading = true;
    this.message = '';

    try {
      if (this.isSubscribed) {
        const success = await this.notificationService.unsubscribeFromNotifications();
        if (success) {
          this.showMessage('Notifications disabled', 'success');
        } else {
          this.showMessage('Error while disabling notifications', 'error');
        }
      } else {
        const success = await this.notificationService.subscribeToNotifications();
        if (success) {
          this.showMessage('Notifications enabled! You will receive daily quotes.', 'success');
        } else {
          this.showMessage('Could not enable notifications. Please check permissions.', 'error');
        }
      }
    } catch (error) {
      this.showMessage('An error occurred', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  private showMessage(text: string, type: string) {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}