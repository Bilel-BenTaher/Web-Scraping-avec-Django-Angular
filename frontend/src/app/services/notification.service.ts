import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private vapidPublicKey = 'BHx04BscUtU2PAUl2tlxIXDBFLXM6WZ0C7iF_r9BtH5Ykk2WjDX_L4domczOPqKQzMptMNVDuqZhbs6TwGXAoPk';
  private isSubscribed = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://127.0.0.1:8000'; // Backend Django URL

  constructor(private http: HttpClient) {
    this.checkSubscriptionStatus();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); // Assurez-vous que le token JWT est bien stocké sous ce nom
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Ce navigateur ne supporte pas les notifications');
      return false;
    }

    if (Notification.permission === 'granted') return true;

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  async subscribeToNotifications(): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) throw new Error('Permission de notification refusée');

      const registration = await navigator.serviceWorker.register('/sw.js');
      await registration.update();

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      await this.http.post(
        `${this.apiUrl}/api/push/subscribe/`,
        { subscription: subscription.toJSON() },
        { headers: this.getAuthHeaders() }
      ).toPromise();

      this.isSubscribed.next(true);
      localStorage.setItem('notifications-enabled', 'true');
      return true;
    } catch (error) {
      console.error('Erreur abonnement notifications:', error);
      return false;
    }
  }

  async unsubscribeFromNotifications(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();

          await this.http.post(
            `${this.apiUrl}/api/push/unsubscribe/`,
            { endpoint: subscription.endpoint },
            { headers: this.getAuthHeaders() }
          ).toPromise();
        }
      }

      this.isSubscribed.next(false);
      localStorage.setItem('notifications-enabled', 'false');
      return true;
    } catch (error) {
      console.error('Erreur désabonnement:', error);
      return false;
    }
  }

  private checkSubscriptionStatus() {
    const enabled = localStorage.getItem('notifications-enabled') === 'true';
    this.isSubscribed.next(enabled);
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  getSubscriptionStatus() {
    return this.isSubscribed.asObservable();
  }
}
