import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private storageKey = 'notifications';
  private notificationsSubject = new BehaviorSubject<any[]>([]);

  notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.loadInitialNotifications();
  }

  private loadInitialNotifications() {
    const notifications = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    this.notificationsSubject.next(notifications);
  }

  getUserNotifications(userId: string) {
    return this.notifications$.pipe(
      map(notifications =>
        notifications.filter(n => n.userId === userId)
      )
    );
  }

  addNotification(userId: string, title: string, message: string) {
    const newNotification = {
      userId,
      title,
      message,
      date: new Date().toISOString(),
      read: false
    };

    const notifications = [...this.notificationsSubject.value, newNotification];
    localStorage.setItem(this.storageKey, JSON.stringify(notifications));
    this.notificationsSubject.next(notifications);
  }
}
