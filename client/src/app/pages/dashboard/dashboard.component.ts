import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ErrorStateComponent } from '../../components/error-state/error-state.component';
import { IconComponent } from '../../components/icon/icon.component';
import { LayoutShellComponent } from '../../components/layout-shell/layout-shell.component';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { DashboardResponse } from '../../models/app.models';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { getErrorMessage } from '../../utils/api-error.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ErrorStateComponent, IconComponent, LayoutShellComponent, MetricCardComponent, StatusBadgeComponent],
  template: `
    <app-layout-shell title="Student Dashboard" subtitle="A calm view of your requests, notices, and profile activity.">
      @if (loading()) {
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          @for (item of [1, 2, 3, 4]; track item) {
            <article class="skeleton-card">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <div class="skeleton h-4 w-24"></div>
                  <div class="mt-4 skeleton h-10 w-20"></div>
                  <div class="mt-4 skeleton h-3 w-32"></div>
                </div>
                <div class="skeleton h-12 w-12 rounded-2xl"></div>
              </div>
            </article>
          }
        </div>

        <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section class="skeleton-card">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div class="skeleton h-6 w-40"></div>
                <div class="mt-3 skeleton h-3 w-56"></div>
              </div>
              <div class="skeleton h-11 w-full rounded-xl sm:w-28"></div>
            </div>
            <div class="mt-5 grid gap-4">
              @for (item of [1, 2, 3]; track item) {
                <article class="rounded-2xl border border-border bg-stone-50/50 p-4 sm:p-5">
                  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div class="min-w-0 flex-1">
                      <div class="skeleton h-5 w-40"></div>
                      <div class="mt-3 skeleton h-3 w-32"></div>
                      <div class="mt-4 skeleton h-3 w-full"></div>
                      <div class="mt-2 skeleton h-3 w-4/5"></div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="skeleton h-10 w-10 rounded-2xl"></div>
                      <div class="skeleton h-7 w-24 rounded-full"></div>
                    </div>
                  </div>
                </article>
              }
            </div>
          </section>

          <section class="grid gap-6">
            <article class="skeleton-card">
              <div class="skeleton h-6 w-44"></div>
              <div class="mt-3 skeleton h-3 w-56"></div>
              <div class="mt-5 grid gap-4">
                @for (item of [1, 2, 3]; track item) {
                  <article class="rounded-2xl border border-border bg-white p-4">
                    <div class="flex items-center justify-between gap-3">
                      <div class="skeleton h-7 w-24 rounded-full"></div>
                      <div class="skeleton h-3 w-20"></div>
                    </div>
                    <div class="mt-4 skeleton h-5 w-40"></div>
                    <div class="mt-3 skeleton h-3 w-full"></div>
                    <div class="mt-2 skeleton h-3 w-5/6"></div>
                  </article>
                }
              </div>
            </article>

            <article class="skeleton-card">
              <div class="skeleton h-6 w-36"></div>
              <div class="mt-5 grid gap-3">
                @for (item of [1, 2, 3, 4]; track item) {
                  <div class="skeleton h-4 w-full"></div>
                }
              </div>
            </article>
          </section>
        </div>
      } @else if (error()) {
        <app-error-state [message]="error()!" (retry)="load()" />
      } @else {
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <app-metric-card label="My Outpasses" [value]="totalOutpasses()" meta="All submitted requests" icon="outpass" />
          <app-metric-card label="Approved" [value]="count('approved')" meta="Ready for download" icon="check" />
          <app-metric-card label="Pending" [value]="count('pending')" meta="Awaiting review" icon="clock" />
          <app-metric-card label="Complaints Raised" [value]="data()?.recentComplaints?.length || 0" meta="Latest support activity" icon="complaint" />
        </div>

        <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section class="panel p-5 sm:p-6">
            <div class="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 class="text-xl font-semibold text-ink">Recent Outpasses</h3>
                <p class="mt-1 text-sm text-muted">Your latest requests in a clean, scannable layout.</p>
              </div>
              <a class="btn-outline w-full sm:w-auto" href="/outpass">View All</a>
            </div>

            @if (data()?.recentOutpasses?.length) {
              <div class="grid gap-4">
                @for (item of data()?.recentOutpasses ?? []; track item._id) {
                  <article class="rounded-2xl border border-border bg-stone-50/70 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-panel sm:p-5">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div class="text-lg font-semibold text-ink">{{ item.destination }}</div>
                        <div class="mt-1 text-sm text-muted">{{ item.fromDate | date:'mediumDate' }} to {{ item.toDate | date:'mediumDate' }}</div>
                        <p class="mt-3 text-sm leading-7 text-muted">{{ item.reason }}</p>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="grid h-10 w-10 place-items-center rounded-2xl bg-white text-brand-600 shadow-sm">
                          <app-icon name="qr" [size]="16" />
                        </span>
                        <app-status-badge [status]="item.status" />
                      </div>
                    </div>
                  </article>
                }
              </div>
            } @else {
              <div class="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted">
                No outpass requests yet. New requests will appear here.
              </div>
            }
          </section>

          <section class="grid gap-6">
            <article class="panel p-5 sm:p-6">
              <h3 class="text-xl font-semibold text-ink">Latest Announcements</h3>
              <p class="mt-1 text-sm text-muted">Important hostel updates presented with clear visual priority.</p>

              @if (data()?.announcements?.length) {
                <div class="mt-5 grid gap-4">
                  @for (announcement of data()?.announcements ?? []; track announcement._id) {
                    <article class="rounded-2xl border border-border bg-white p-4" [class.border-[#d2b08f]]="announcement.priority === 'important'">
                      <div class="flex items-center justify-between gap-3">
                        <span class="status-badge {{ announcement.priority === 'important' ? 'status-pending' : 'status-in-progress' }}">
                          {{ announcement.priority }}
                        </span>
                        <span class="text-xs text-muted">{{ announcement.createdAt | date:'mediumDate' }}</span>
                      </div>
                      <h4 class="mt-3 font-semibold text-ink">{{ announcement.title }}</h4>
                      <p class="mt-2 text-sm leading-7 text-muted">{{ announcement.description }}</p>
                    </article>
                  }
                </div>
              } @else {
                <div class="mt-5 rounded-3xl border border-dashed border-border p-6 text-sm text-muted">No announcements available right now.</div>
              }
            </article>

            <article class="panel p-5 sm:p-6">
              <h3 class="text-xl font-semibold text-ink">Profile Snapshot</h3>
              <div class="mt-5 grid gap-3 text-sm text-ink">
                <div><strong>Name:</strong> {{ authService.user()?.name }}</div>
                <div><strong>Register No:</strong> {{ authService.user()?.registerNo || 'N/A' }}</div>
                <div><strong>Department:</strong> {{ authService.user()?.department || 'N/A' }}</div>
                <div><strong>Block / Room:</strong> {{ authService.user()?.blockNo || 'N/A' }} / {{ authService.user()?.roomNo || 'N/A' }}</div>
              </div>
            </article>
          </section>
        </div>
      }
    </app-layout-shell>
  `
})
export class DashboardComponent {
  readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  readonly data = signal<DashboardResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.error.set(null);
    this.loading.set(true);
    this.authService.getStudentDashboard().subscribe({
      next: (response) => {
        this.data.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        const message = getErrorMessage(error, 'Unable to load dashboard');
        this.error.set(message);
        this.loading.set(false);
        this.toastService.show(message, 'error');
      }
    });
  }

  count(status: string): number {
    return this.data()?.outpassCounts.find((item) => item._id === status)?.count || 0;
  }

  totalOutpasses(): number {
    return (this.data()?.outpassCounts || []).reduce((sum, item) => sum + item.count, 0);
  }
}
