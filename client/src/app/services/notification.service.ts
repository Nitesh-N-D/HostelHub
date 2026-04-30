import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationItem, NotificationResponse } from '../models/app.models';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);

  readonly notifications = signal<NotificationItem[]>([]);
  readonly unreadCount = signal(0);

  load(limit = 20) {
    return this.http.get<NotificationResponse>(`${environment.apiUrl}/notifications?limit=${limit}`);
  }

  sync(response: NotificationResponse): void {
    this.notifications.set(response.notifications);
    this.unreadCount.set(response.unreadCount);
  }

  prepend(notification: NotificationItem): void {
    this.notifications.set([notification, ...this.notifications()].slice(0, 100));
    this.unreadCount.set(this.unreadCount() + (notification.isRead ? 0 : 1));
  }

  markRead(id: string) {
    return this.http.patch<{ success?: boolean; message: string }>(`${environment.apiUrl}/notifications/${id}/read`, {});
  }

  markAllRead() {
    return this.http.patch<{ success?: boolean; message: string }>(`${environment.apiUrl}/notifications/read-all`, {});
  }

  clearAll() {
    return this.http.delete<{ success?: boolean; message: string }>(`${environment.apiUrl}/notifications/clear-all`);
  }
}
