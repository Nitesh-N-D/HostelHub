import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ToastService } from '../../services/toast.service';
import { getErrorMessage } from '../../utils/api-error.util';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="page-shell bg-bg lg:grid lg:min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
      <div
        class="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        [class.hidden]="!sidebarOpen()"
        (click)="sidebarOpen.set(false)"
      ></div>

      <aside
        class="fixed inset-y-0 left-0 z-40 w-[86vw] max-w-[280px] -translate-x-full border-r border-border bg-[#1c1c1e] px-3 py-4 text-stone-100 transition duration-300 sm:px-4 sm:py-5 lg:static lg:w-[280px] lg:translate-x-0"
        [class.translate-x-0]="sidebarOpen()"
      >
        <div class="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/5 p-4">
          <div class="flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-lg font-bold text-white shadow-glow">H</div>
            <div>
              <h1 class="text-xl font-semibold text-white">HostelHub</h1>
              <p class="text-sm text-stone-400">{{ authService.isAdmin() ? 'University operations suite' : 'Student residence portal' }}</p>
            </div>
          </div>

          <nav class="mt-8 grid gap-2">
            @for (link of links(); track link.path) {
              <a
                class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-300 transition duration-300 hover:bg-white/10 hover:text-white"
                [routerLink]="link.path"
                routerLinkActive="bg-white/10 text-white"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="sidebarOpen.set(false)"
              >
                <app-icon [name]="link.icon" [size]="18" />
                <span>{{ link.label }}</span>
              </a>
            }
          </nav>

          <div class="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4">
            <div class="flex items-center gap-3">
              <div class="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-sm font-bold text-white">
                {{ initials() }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-white">{{ authService.user()?.name }}</p>
                <p class="truncate text-xs text-stone-400">{{ authService.user()?.email }}</p>
              </div>
            </div>
            <button class="btn-secondary mt-4 w-full" type="button" (click)="authService.logout()">
              <app-icon name="logout" [size]="16" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <main class="min-w-0">
        <div class="section-shell py-4 lg:py-6">
          <header class="glass-card sticky top-3 z-20 mb-5 flex flex-col gap-4 px-3 py-3 sm:px-4 sm:py-4 lg:top-4 lg:mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-start gap-3 sm:items-center">
              <button class="btn-outline lg:hidden" type="button" (click)="toggleSidebar()">
                <app-icon name="menu" [size]="16" />
                <span>Menu</span>
              </button>
              <div class="min-w-0">
                <h2 class="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{{ title() }}</h2>
                <p class="mt-1 max-w-2xl text-sm leading-6 text-muted">{{ subtitle() }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 self-start sm:self-auto">
              <button class="relative rounded-2xl border border-border bg-white px-3 py-2 shadow-sm transition hover:bg-stone-50" type="button" (click)="toggleNotifications()">
                <app-icon name="bell" [size]="18" />
                @if (notificationService.unreadCount() > 0) {
                  <span class="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                    {{ notificationService.unreadCount() > 9 ? '9+' : notificationService.unreadCount() }}
                  </span>
                }
              </button>
              <a class="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-white px-3 py-2 shadow-sm" routerLink="/profile">
                <div class="grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient text-sm font-bold text-white">
                  {{ initials() }}
                </div>
                <div class="min-w-0 hidden sm:block">
                  <div class="text-sm font-semibold text-ink">{{ authService.isAdmin() ? 'Admin' : 'Student' }}</div>
                  <div class="text-xs text-muted">Profile</div>
                </div>
              </a>
            </div>
          </header>

          @if (notificationsOpen()) {
            <section class="panel mb-6 p-4 sm:p-5">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-ink">Notifications</h3>
                  <p class="text-sm text-muted">Updates for approvals, complaints, and announcements.</p>
                </div>
                <div class="flex flex-col gap-3 sm:flex-row">
                  <button class="btn-outline w-full sm:w-auto" type="button" (click)="refreshNotifications()">Refresh</button>
                  <button class="btn-secondary w-full sm:w-auto" type="button" (click)="markAllRead()" [disabled]="!notificationService.unreadCount()">Mark all read</button>
                  <button class="btn-danger w-full sm:w-auto" type="button" (click)="clearAllNotifications()" [disabled]="!notificationService.notifications().length">Clear all</button>
                  <a class="btn-primary w-full sm:w-auto" routerLink="/notifications" (click)="notificationsOpen.set(false)">Open History</a>
                </div>
              </div>

              @if (notificationService.notifications().length) {
                <div class="mt-4 grid gap-3">
                  @for (item of notificationService.notifications(); track item._id) {
                    <button
                      class="w-full rounded-2xl border px-4 py-4 text-left transition hover:bg-stone-50"
                      [class.border-brand-200]="!item.isRead"
                      [class.bg-brand-50/50]="!item.isRead"
                      [class.border-border]="item.isRead"
                      [class.bg-white]="item.isRead"
                      type="button"
                      (click)="openNotification(item._id, item.link)"
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0">
                          <div class="text-sm font-semibold text-ink">{{ item.title }}</div>
                          <div class="mt-1 text-sm leading-6 text-muted">{{ item.message }}</div>
                        </div>
                        <div class="shrink-0 text-xs text-muted">{{ item.createdAt | date:'short' }}</div>
                      </div>
                    </button>
                  }
                </div>
              } @else {
                <div class="mt-4 rounded-2xl border border-dashed border-border p-6 text-sm text-muted">No notifications yet.</div>
              }
            </section>
          }

          <section class="grid gap-6">
            <ng-content />
          </section>
        </div>
      </main>
    </div>
  `
})
export class LayoutShellComponent {
  readonly authService = inject(AuthService);
  readonly notificationService = inject(NotificationService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  readonly title = input.required<string>();
  readonly subtitle = input<string>('Manage hostel workflows with clarity.');
  readonly sidebarOpen = signal(false);
  readonly notificationsOpen = signal(false);

  readonly links = computed(() =>
    this.authService.isAdmin()
      ? [
          { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
          { path: '/outpass', label: 'Outpass', icon: 'outpass' },
          { path: '/complaints', label: 'Complaints', icon: 'complaint' },
          { path: '/announcements', label: 'Announcements', icon: 'announcement' },
          { path: '/notifications', label: 'Notifications', icon: 'bell' },
          { path: '/profile', label: 'Profile', icon: 'profile' }
        ]
      : [
          { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
          { path: '/outpass', label: 'Outpass', icon: 'outpass' },
          { path: '/complaints', label: 'Complaints', icon: 'complaint' },
          { path: '/announcements', label: 'Announcements', icon: 'announcement' },
          { path: '/notifications', label: 'Notifications', icon: 'bell' },
          { path: '/profile', label: 'Profile', icon: 'profile' }
        ]
  );

  readonly initials = computed(() =>
    this.authService
      .user()
      ?.name.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'HH'
  );

  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.refreshNotifications();
    this.refreshTimer = setInterval(() => this.refreshNotifications(false), 30000);
    this.destroyRef.onDestroy(() => {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  toggleNotifications(): void {
    this.notificationsOpen.set(!this.notificationsOpen());
    if (this.notificationsOpen()) {
      this.refreshNotifications(false);
    }
  }

  refreshNotifications(showError = true): void {
    this.notificationService.load().subscribe({
      next: (response) => this.notificationService.sync(response),
      error: (error) => {
        if (showError) {
          this.toastService.show(getErrorMessage(error, 'Unable to load notifications'), 'error');
        }
      }
    });
  }

  markAllRead(): void {
    this.notificationService.markAllRead().subscribe({
      next: () => this.refreshNotifications(false),
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to update notifications'), 'error')
    });
  }

  clearAllNotifications(): void {
    this.notificationService.clearAll().subscribe({
      next: () => {
        this.notificationService.notifications.set([]);
        this.notificationService.unreadCount.set(0);
        this.toastService.show('All notifications cleared', 'success');
      },
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to clear notifications'), 'error')
    });
  }

  openNotification(id: string, link: string): void {
    const current = this.notificationService.notifications();
    this.notificationService.notifications.set(
      current.map((item) => (item._id === id ? { ...item, isRead: true } : item))
    );
    this.notificationService.unreadCount.set(Math.max(0, this.notificationService.unreadCount() - 1));

    this.notificationService.markRead(id).subscribe({
      next: () => {
        if (link) {
          this.notificationsOpen.set(false);
          this.router.navigateByUrl(link);
        }
      },
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to open notification'), 'error')
    });
  }
}
