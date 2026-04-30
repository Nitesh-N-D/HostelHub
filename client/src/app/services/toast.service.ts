import { Injectable, signal } from '@angular/core';

export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);

  show(message: string, type: ToastItem['type'] = 'info'): void {
    const id = Date.now();
    this.toasts.update((value) => [...value, { id, message, type }]);
    window.setTimeout(() => this.dismiss(id), 3200);
  }

  dismiss(id: number): void {
    this.toasts.update((value) => value.filter((toast) => toast.id !== id));
  }
}
