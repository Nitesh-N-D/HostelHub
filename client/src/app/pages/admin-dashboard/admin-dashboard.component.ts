import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js';
import { ErrorStateComponent } from '../../components/error-state/error-state.component';
import { LayoutShellComponent } from '../../components/layout-shell/layout-shell.component';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { AdminStats } from '../../models/app.models';
import { AdminService } from '../../services/admin.service';
import { ToastService } from '../../services/toast.service';
import { getErrorMessage } from '../../utils/api-error.util';

Chart.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Tooltip);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, ErrorStateComponent, LayoutShellComponent, MetricCardComponent, StatusBadgeComponent],
  template: `
    <app-layout-shell title="Admin Dashboard" subtitle="A clear operations view for approvals, complaints, announcements, and student movement.">
      @if (loading()) {
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          @for (item of [1, 2, 3, 4]; track item) {
            <article class="skeleton-card">
              <div class="skeleton h-4 w-24"></div>
              <div class="mt-4 skeleton h-10 w-24"></div>
              <div class="mt-4 skeleton h-3 w-36"></div>
            </article>
          }
        </div>

        <div class="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <section class="skeleton-card">
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="skeleton h-6 w-32"></div>
                <div class="mt-3 skeleton h-3 w-44"></div>
              </div>
              <div class="skeleton h-7 w-20 rounded-full"></div>
            </div>
            <div class="mt-5 grid gap-3">
              @for (item of [1, 2, 3]; track item) {
                <article class="rounded-2xl border border-border bg-stone-50/50 px-4 py-4">
                  <div class="flex items-start gap-3">
                    <div class="min-w-0 flex-1">
                      <div class="skeleton h-4 w-40"></div>
                      <div class="mt-3 skeleton h-3 w-full"></div>
                      <div class="mt-2 skeleton h-3 w-5/6"></div>
                    </div>
                    <div class="skeleton h-7 w-20 rounded-full"></div>
                  </div>
                </article>
              }
            </div>
          </section>

          <section class="skeleton-card">
            <div class="skeleton h-6 w-36"></div>
            <div class="mt-3 skeleton h-3 w-52"></div>
            <div class="mt-5 grid gap-4 sm:grid-cols-2">
              @for (item of [1, 2, 3, 4]; track item) {
                <article class="rounded-2xl border border-border bg-stone-50/50 p-4">
                  <div class="skeleton h-3 w-28"></div>
                  <div class="mt-3 skeleton h-9 w-16"></div>
                </article>
              }
            </div>
          </section>
        </div>

        <div class="grid gap-6 xl:grid-cols-2">
          @for (item of [1, 2, 3, 4]; track item) {
            <section class="skeleton-card">
              <div class="skeleton h-6 w-40"></div>
              <div class="mt-3 skeleton h-3 w-48"></div>
              <div class="mt-5 skeleton h-[260px] w-full rounded-2xl sm:h-[300px]"></div>
            </section>
          }
        </div>

        <div class="grid gap-6 xl:grid-cols-2">
          @for (item of [1, 2]; track item) {
            <section class="table-shell">
              <div class="border-b border-border bg-stone-50/70 px-4 py-4 sm:px-6 sm:py-5">
                <div class="skeleton h-6 w-40"></div>
                <div class="mt-3 skeleton h-3 w-48"></div>
              </div>
              <div class="space-y-4 p-4 sm:p-6">
                @for (row of [1, 2, 3, 4]; track row) {
                  <div class="grid gap-3 sm:grid-cols-3">
                    <div class="skeleton h-4 w-full"></div>
                    <div class="skeleton h-4 w-full"></div>
                    <div class="skeleton h-4 w-full"></div>
                  </div>
                }
              </div>
            </section>
          }
        </div>
      } @else if (error()) {
        <app-error-state [message]="error()!" (retry)="load()" />
      } @else {
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <app-metric-card label="Total Students" [value]="stats()?.summary?.totalStudents || 0" meta="Current hostel residents" icon="profile" />
          <app-metric-card label="Outpasses" [value]="stats()?.summary?.totalOutpasses || 0" meta="Requests across all statuses" icon="outpass" />
          <app-metric-card label="Complaints" [value]="stats()?.summary?.totalComplaints || 0" meta="Issues that need follow-up" icon="complaint" />
          <app-metric-card label="Announcements" [value]="stats()?.summary?.activeAnnouncements || 0" meta="Visible notices for students" icon="announcement" />
        </div>

        <div class="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <section class="panel p-5 sm:p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-ink">Admin actions</h3>
                <p class="mt-1 text-sm text-muted">The main tasks you usually need during the day.</p>
              </div>
              <span class="status-badge status-approved">Active</span>
            </div>

            <div class="mt-5 grid gap-3">
              @for (action of adminActions; track action.title) {
                <article class="rounded-2xl border border-border bg-stone-50/70 px-4 py-4">
                  <div class="flex items-start gap-3">
                    <div class="min-w-0 flex-1">
                      <div class="text-sm font-semibold text-ink">{{ action.title }}</div>
                      <div class="mt-1 text-sm leading-6 text-muted">{{ action.description }}</div>
                    </div>
                    <span class="status-badge {{ action.statusClass }}">{{ action.statusLabel }}</span>
                  </div>
                </article>
              }
            </div>
          </section>

          <section class="panel p-5 sm:p-6">
            <h3 class="text-xl font-semibold text-ink">Today at a glance</h3>
            <p class="mt-1 text-sm text-muted">A quick view of approvals, issue handling, and notice activity.</p>

            <div class="mt-5 grid gap-4 sm:grid-cols-2">
              <article class="rounded-2xl border border-border bg-stone-50/70 p-4">
                <p class="text-sm font-medium text-muted">Approved requests</p>
                <div class="mt-2 text-3xl font-semibold text-ink">{{ statusCount('approved') }}</div>
              </article>
              <article class="rounded-2xl border border-border bg-stone-50/70 p-4">
                <p class="text-sm font-medium text-muted">Pending requests</p>
                <div class="mt-2 text-3xl font-semibold text-ink">{{ statusCount('pending') }}</div>
              </article>
              <article class="rounded-2xl border border-border bg-stone-50/70 p-4">
                <p class="text-sm font-medium text-muted">Complaints in progress</p>
                <div class="mt-2 text-3xl font-semibold text-ink">{{ complaintCount('in-progress') }}</div>
              </article>
              <article class="rounded-2xl border border-border bg-stone-50/70 p-4">
                <p class="text-sm font-medium text-muted">Important notices</p>
                <div class="mt-2 text-3xl font-semibold text-ink">{{ stats()?.summary?.activeAnnouncements || 0 }}</div>
              </article>
            </div>
          </section>
        </div>

        <div class="grid gap-6 xl:grid-cols-2">
          <section class="chart-panel">
            <h3 class="text-xl font-semibold text-ink">Outpass Trends</h3>
            <p class="mt-1 text-sm text-muted">Monthly request volume for hostel operations.</p>
            <div class="chart-frame"><canvas baseChart [data]="trendChartData()" [options]="chartOptions" [type]="'bar'"></canvas></div>
          </section>

          <section class="chart-panel">
            <h3 class="text-xl font-semibold text-ink">Complaint Status Distribution</h3>
            <p class="mt-1 text-sm text-muted">Current resolution mix across all complaints.</p>
            <div class="chart-frame"><canvas baseChart [data]="complaintChartData()" [options]="pieOptions" [type]="'pie'"></canvas></div>
          </section>

          <section class="chart-panel">
            <h3 class="text-xl font-semibold text-ink">Block-Wise Distribution</h3>
            <p class="mt-1 text-sm text-muted">Student occupancy by block.</p>
            <div class="chart-frame"><canvas baseChart [data]="blockChartData()" [options]="chartOptions" [type]="'bar'"></canvas></div>
          </section>

          <section class="chart-panel">
            <h3 class="text-xl font-semibold text-ink">Outpass Status Mix</h3>
            <p class="mt-1 text-sm text-muted">Pending, approved, and rejected request distribution.</p>
            <div class="chart-frame"><canvas baseChart [data]="outpassChartData()" [options]="pieOptions" [type]="'doughnut'"></canvas></div>
          </section>
        </div>

        <div class="grid gap-6 xl:grid-cols-2">
          <section class="table-shell">
            <div class="border-b border-border bg-stone-50/70 px-4 py-4 sm:px-6 sm:py-5">
              <h3 class="text-xl font-semibold text-ink">Recent Outpasses</h3>
              <p class="mt-1 text-sm text-muted">Latest requests entering the admin queue.</p>
            </div>
            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Hostel</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of stats()?.recentOutpasses ?? []; track item._id) {
                    <tr>
                      <td>{{ item.userId.name }}</td>
                      <td>{{ item.userId.blockNo }} / {{ item.userId.roomNo }}</td>
                      <td><app-status-badge [status]="item.status" /></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>

          <section class="table-shell">
            <div class="border-b border-border bg-stone-50/70 px-4 py-4 sm:px-6 sm:py-5">
              <h3 class="text-xl font-semibold text-ink">Recent Complaints</h3>
              <p class="mt-1 text-sm text-muted">Newest issue tickets raised by students.</p>
            </div>
            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of stats()?.recentComplaints ?? []; track item._id) {
                    <tr>
                      <td>{{ item.userId.name }}</td>
                      <td>{{ item.title }}</td>
                      <td><app-status-badge [status]="item.status" /></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        </div>
      }
    </app-layout-shell>
  `
})
export class AdminDashboardComponent {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);
  readonly stats = signal<AdminStats | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly adminActions = [
    {
      title: 'Review new outpass requests',
      description: 'Check pending approvals and update the decision for student travel requests.',
      statusLabel: 'Queue',
      statusClass: 'status-in-progress'
    },
    {
      title: 'Track hostel complaints',
      description: 'Keep room issues moving until they are resolved and marked complete.',
      statusLabel: 'Follow up',
      statusClass: 'status-pending'
    },
    {
      title: 'Publish important notices',
      description: 'Keep students informed with clear, visible announcements.',
      statusLabel: 'Notice',
      statusClass: 'status-approved'
    }
  ];

  readonly chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1C1C1E',
        titleColor: '#FFFFFF',
        bodyColor: '#F5F5F4',
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: '#F1F0EE'
        },
        ticks: {
          color: '#6B7280'
        }
      }
    }
  };

  readonly pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#6B7280',
          usePointStyle: true,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: '#1C1C1E',
        titleColor: '#FFFFFF',
        bodyColor: '#F5F5F4',
        padding: 12
      }
    }
  };

  constructor() {
    this.load();
  }

  load(): void {
    this.error.set(null);
    this.loading.set(true);
    this.adminService.getStats().subscribe({
      next: (response) => {
        this.stats.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        const message = getErrorMessage(error, 'Unable to load admin analytics');
        this.error.set(message);
        this.loading.set(false);
        this.toastService.show(message, 'error');
      }
    });
  }

  outpassChartData() {
    const series = this.stats()?.outpassStatus || [];
    return {
      labels: series.map((item) => item._id),
      datasets: [{ data: series.map((item) => item.count), backgroundColor: ['#C08457', '#059669', '#DC2626'], borderWidth: 0 }]
    };
  }

  complaintChartData() {
    const series = this.stats()?.complaintStatus || [];
    return {
      labels: series.map((item) => item._id),
      datasets: [{ data: series.map((item) => item.count), backgroundColor: ['#C08457', '#6D28D9', '#059669'], borderWidth: 0 }]
    };
  }

  blockChartData() {
    const series = this.stats()?.studentsPerBlock || [];
    return {
      labels: series.map((item) => item._id || 'Unassigned'),
      datasets: [{ data: series.map((item) => item.count), label: 'Students', backgroundColor: '#8B5CF6', borderRadius: 10 }]
    };
  }

  trendChartData() {
    const series = this.stats()?.monthlyOutpassTrends || [];
    return {
      labels: series.map((item) => `${item._id.month}/${item._id.year}`),
      datasets: [{ data: series.map((item) => item.count), label: 'Outpasses', backgroundColor: '#6D28D9', borderRadius: 10 }]
    };
  }

  statusCount(status: string): number {
    return this.stats()?.outpassStatus.find((item) => item._id === status)?.count || 0;
  }

  complaintCount(status: string): number {
    return this.stats()?.complaintStatus.find((item) => item._id === status)?.count || 0;
  }
}
