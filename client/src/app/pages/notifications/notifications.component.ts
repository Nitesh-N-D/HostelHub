import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorStateComponent } from '../../components/error-state/error-state.component';
import { IconComponent } from '../../components/icon/icon.component';
import { LayoutShellComponent } from '../../components/layout-shell/layout-shell.component';
import { NotificationItem } from '../../models/app.models';
import { NotificationService } from '../../services/notification.service';
import { ToastService } from '../../services/toast.service';
import { getErrorMessage } from '../../utils/api-error.util';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, ErrorStateComponent, IconComponent, LayoutShellComponent],
  template: `
    <app-layout-shell title="Notifications" subtitle="A complete history of approvals, complaint updates, and hostel announcements.">
      @if (loading()) {
        <section class="skeleton-card">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div class="skeleton h-6 w-44"></div>
              <div class="mt-3 skeleton h-3 w-64"></div>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row">
              <div class="skeleton h-11 w-full rounded-xl sm:w-24"></div>
              <div class="skeleton h-11 w-full rounded-xl sm:w-32"></div>
              <div class="skeleton h-11 w-full rounded-xl sm:w-28"></div>
            </div>
          </div>

          <div class="mt-5 grid gap-4 sm:grid-cols-3">
            @for (item of [1, 2, 3]; track item) {
              <article class="rounded-2xl border border-border bg-stone-50/50 p-4">
                <div class="skeleton h-3 w-20"></div>
                <div class="mt-3 skeleton h-9 w-20"></div>
              </article>
            }
          </div>
        </section>

        <section class="grid gap-4">
          @for (item of [1, 2, 3, 4]; track item) {
            <article class="skeleton-card">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="flex min-w-0 gap-4">
                  <div class="skeleton h-11 w-11 shrink-0 rounded-2xl"></div>
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-3">
                      <div class="skeleton h-5 w-36"></div>
                      <div class="skeleton h-7 w-20 rounded-full"></div>
                    </div>
                    <div class="mt-3 skeleton h-3 w-full"></div>
                    <div class="mt-2 skeleton h-3 w-5/6"></div>
                  </div>
                </div>
                <div class="flex flex-col gap-3 lg:items-end">
                  <div class="skeleton h-3 w-24"></div>
                  <div class="flex flex-col gap-3 sm:flex-row">
                    <div class="skeleton h-11 w-full rounded-xl sm:w-24"></div>
                    <div class="skeleton h-11 w-full rounded-xl sm:w-20"></div>
                  </div>
                </div>
              </div>
            </article>
          }
        </section>
      } @else if (error()) {
        <app-error-state [message]="error()!" (retry)="load()" />
      } @else {
        <section class="panel p-5 sm:p-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 class="text-xl font-semibold text-ink">Notification History</h3>
              <p class="mt-1 text-sm text-muted">Every important update is collected here so students and admins can revisit activity anytime.</p>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row">
              <button class="btn-outline w-full sm:w-auto" type="button" (click)="load()">Refresh</button>
              <button class="btn-secondary w-full sm:w-auto" type="button" (click)="markAllRead()" [disabled]="!notificationService.unreadCount()">Mark all read</button>
              <button class="btn-danger w-full sm:w-auto" type="button" (click)="clearAll()" [disabled]="!notifications().length">Clear all</button>
            </div>
          </div>

          <div class="mt-5 grid gap-4 sm:grid-cols-3">
            <article class="rounded-2xl border border-border bg-stone-50/70 p-4">
              <p class="text-sm font-medium text-muted">Unread</p>
              <p class="mt-2 text-3xl font-semibold text-ink">{{ notificationService.unreadCount() }}</p>
            </article>
            <article class="rounded-2xl border border-border bg-stone-50/70 p-4">
              <p class="text-sm font-medium text-muted">Loaded</p>
              <p class="mt-2 text-3xl font-semibold text-ink">{{ notifications().length }}</p>
            </article>
            <article class="rounded-2xl border border-border bg-stone-50/70 p-4">
              <p class="text-sm font-medium text-muted">Latest activity</p>
              <p class="mt-2 text-lg font-semibold text-ink">{{ latestLabel() }}</p>
            </article>
          </div>
        </section>

        @if (notifications().length) {
          <section class="grid gap-4">
            @for (item of notifications(); track item._id) {
              <article
                class="panel p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft sm:p-6"
                [class.border-brand-200]="!item.isRead"
                [class.bg-brand-50/40]="!item.isRead"
              >
                <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div class="flex min-w-0 gap-4">
                    <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-stone-100 text-brand-600">
                      <app-icon [name]="iconFor(item.type)" [size]="18" />
                    </div>
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-3">
                        <h4 class="text-base font-semibold text-ink">{{ item.title }}</h4>
                        <span class="status-badge {{ badgeClass(item.type) }}">{{ item.type }}</span>
                        @if (!item.isRead) {
                          <span class="rounded-full bg-brand-600 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">New</span>
                        }
                      </div>
                      <p class="mt-2 text-sm leading-7 text-muted">{{ item.message }}</p>
                    </div>
                  </div>

                  <div class="flex flex-col gap-3 lg:items-end">
                    <div class="text-xs text-muted">{{ item.createdAt | date:'medium' }}</div>
                    <div class="flex flex-col gap-3 sm:flex-row">
                      @if (!item.isRead) {
                        <button class="btn-outline w-full sm:w-auto" type="button" (click)="markRead(item)">Mark read</button>
                      }
                      @if (item.link) {
                        <button class="btn-primary w-full sm:w-auto" type="button" (click)="open(item)">Open</button>
                      }
                    </div>
                  </div>
                </div>
              </article>
            }
          </section>
        } @else {
          <section class="panel p-10 text-center">
            <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-stone-100 text-brand-600">
              <app-icon name="bell" [size]="22" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-ink">No notifications yet</h3>
            <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
              Once hostel activity starts, approvals, complaint changes, and announcements will appear here.
            </p>
          </section>
        }
      }
    </app-layout-shell>
  `
})
export class NotificationsComponent {
  readonly notificationService = inject(NotificationService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  readonly notifications = signal<NotificationItem[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly latestLabel = signal('No activity yet');

  constructor() {
    this.load();
  }

  load(): void {
    this.error.set(null);
    this.loading.set(true);
    this.notificationService.load(100).subscribe({
      next: (response) => {
        this.notificationService.sync(response);
        this.notifications.set(response.notifications);
        this.latestLabel.set(response.notifications[0]?.type || 'No activity yet');
        this.loading.set(false);
      },
      error: (error) => {
        const message = getErrorMessage(error, 'Unable to load notifications');
        this.error.set(message);
        this.loading.set(false);
        this.toastService.show(message, 'error');
      }
    });
  }

  markAllRead(): void {
    this.notificationService.markAllRead().subscribe({
      next: () => this.load(),
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to update notifications'), 'error')
    });
  }

  clearAll(): void {
    this.notificationService.clearAll().subscribe({
      next: ({ message }) => {
        this.notificationService.notifications.set([]);
        this.notificationService.unreadCount.set(0);
        this.notifications.set([]);
        this.latestLabel.set('No activity yet');
        this.toastService.show(message, 'success');
      },
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to clear notifications'), 'error')
    });
  }

  markRead(item: NotificationItem): void {
    this.notificationService.markRead(item._id).subscribe({
      next: () => this.load(),
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to mark notification as read'), 'error')
    });
  }

  open(item: NotificationItem): void {
    const request = item.isRead ? null : this.notificationService.markRead(item._id);
    if (!request) {
      this.router.navigateByUrl(item.link || '/notifications');
      return;
    }

    request.subscribe({
      next: () => this.router.navigateByUrl(item.link || '/notifications'),
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to open notification'), 'error')
    });
  }

  iconFor(type: NotificationItem['type']): string {
    if (type === 'outpass') return 'outpass';
    if (type === 'complaint') return 'complaint';
    if (type === 'announcement') return 'announcement';
    return 'bell';
  }

  badgeClass(type: NotificationItem['type']): string {
    if (type === 'outpass') return 'status-in-progress';
    if (type === 'complaint') return 'status-pending';
    if (type === 'announcement') return 'status-approved';
    return 'status-in-progress';
  }
}
