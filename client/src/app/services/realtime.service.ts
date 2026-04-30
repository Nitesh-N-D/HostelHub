import { Injectable, NgZone, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { NotificationItem } from '../models/app.models';
import { NotificationService } from './notification.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private readonly notificationService = inject(NotificationService);
  private readonly toastService = inject(ToastService);
  private readonly zone = inject(NgZone);
  private socket: Socket | null = null;

  connect(apiUrl: string, token: string): void {
    if (!token) return;
    if (this.socket?.connected) return;

    const socketUrl = apiUrl.replace(/\/api$/, '');
    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('notification:new', (notification: NotificationItem) => {
      this.zone.run(() => {
        this.notificationService.prepend(notification);
        this.toastService.show(notification.title, 'info');
      });
    });
  }

  disconnect(): void {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }
}
