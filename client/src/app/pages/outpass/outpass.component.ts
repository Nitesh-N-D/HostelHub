import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateComponent } from '../../components/error-state/error-state.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { IconComponent } from '../../components/icon/icon.component';
import { LayoutShellComponent } from '../../components/layout-shell/layout-shell.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { Outpass } from '../../models/app.models';
import { AuthService } from '../../services/auth.service';
import { OutpassService } from '../../services/outpass.service';
import { ToastService } from '../../services/toast.service';
import { getErrorMessage } from '../../utils/api-error.util';

const dateRangeValidator = () => {
  return (group: import('@angular/forms').AbstractControl) => {
    const fromDate = group.get('fromDate')?.value;
    const toDate = group.get('toDate')?.value;

    if (!fromDate || !toDate) {
      return null;
    }

    return new Date(toDate) >= new Date(fromDate) ? null : { dateRange: true };
  };
};

@Component({
  selector: 'app-outpass',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorStateComponent,
    FormErrorComponent,
    IconComponent,
    LayoutShellComponent,
    StatusBadgeComponent
  ],
  template: `
    <app-layout-shell
      [title]="isAdmin() ? 'Outpass Operations' : 'Outpass Requests'"
      [subtitle]="isAdmin() ? 'Search, filter, and process student requests from one streamlined queue.' : 'Submit and track outpasses with a structured, production-grade request experience.'"
    >
      @if (loading()) {
        @if (!isAdmin()) {
          <div class="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
            <section class="skeleton-card">
              <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div class="skeleton h-6 w-36"></div>
                  <div class="mt-3 skeleton h-3 w-56"></div>
                </div>
                <div class="skeleton h-12 w-full rounded-2xl md:w-40"></div>
              </div>

              <div class="mt-6 grid gap-5">
                <section class="rounded-2xl border border-border bg-stone-50/50 p-5">
                  <div class="skeleton h-5 w-28"></div>
                  <div class="mt-4 grid gap-3 sm:grid-cols-2">
                    @for (item of [1, 2, 3, 4]; track item) {
                      <div class="skeleton h-4 w-full"></div>
                    }
                  </div>
                </section>

                <section class="rounded-2xl border border-border bg-white p-5">
                  <div class="skeleton h-5 w-32"></div>
                  <div class="mt-4 grid gap-5 sm:grid-cols-2">
                    @for (item of [1, 2, 3, 4]; track item) {
                      <div>
                        <div class="skeleton h-4 w-24"></div>
                        <div class="mt-3 skeleton h-11 w-full rounded-xl"></div>
                      </div>
                    }
                  </div>
                </section>

                <section class="rounded-2xl border border-border bg-white p-5">
                  <div class="skeleton h-5 w-20"></div>
                  <div class="mt-4">
                    <div class="skeleton h-4 w-28"></div>
                    <div class="mt-3 skeleton h-32 w-full rounded-xl"></div>
                  </div>
                </section>

                <div class="flex flex-col justify-end gap-3 sm:flex-row">
                  <div class="skeleton h-11 w-full rounded-xl sm:w-24"></div>
                  <div class="skeleton h-11 w-full rounded-xl sm:w-36"></div>
                </div>
              </div>
            </section>

            <section class="grid gap-6">
              <article class="skeleton-card">
                <div class="flex items-center gap-3">
                  <div class="skeleton h-11 w-11 rounded-2xl"></div>
                  <div>
                    <div class="skeleton h-5 w-24"></div>
                    <div class="mt-2 skeleton h-3 w-28"></div>
                  </div>
                </div>
                <div class="mt-5 skeleton min-h-[220px] w-full rounded-2xl"></div>
              </article>

              <article class="skeleton-card">
                <div class="skeleton h-5 w-36"></div>
                <div class="mt-4 grid gap-3">
                  @for (item of [1, 2, 3]; track item) {
                    <div class="skeleton h-4 w-full"></div>
                  }
                </div>
              </article>
            </section>
          </div>
        } @else {
          <section class="skeleton-card">
            <div class="skeleton h-6 w-36"></div>
            <div class="mt-3 skeleton h-3 w-52"></div>
            <div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))_auto]">
              @for (item of [1, 2, 3, 4, 5, 6]; track item) {
                <div>
                  <div class="skeleton h-4 w-20"></div>
                  <div class="mt-3 skeleton h-11 w-full rounded-xl"></div>
                </div>
              }
            </div>
          </section>
        }

        <section class="table-shell">
          <div class="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <div class="skeleton h-6 w-36"></div>
            <div class="mt-3 skeleton h-3 w-56"></div>
          </div>
          <div class="space-y-4 p-4 sm:p-6">
            @for (row of [1, 2, 3, 4]; track row) {
              @if (isAdmin()) {
                <div class="grid gap-3 sm:grid-cols-7">
                  <div class="skeleton h-4 w-full"></div>
                  <div class="skeleton h-4 w-full"></div>
                  <div class="skeleton h-4 w-full"></div>
                  <div class="skeleton h-4 w-full"></div>
                  <div class="skeleton h-4 w-full"></div>
                  <div class="skeleton h-4 w-full"></div>
                  <div class="skeleton h-10 w-full rounded-xl"></div>
                </div>
              } @else {
                <div class="grid gap-3 sm:grid-cols-4">
                  <div class="skeleton h-4 w-full"></div>
                  <div class="skeleton h-4 w-full"></div>
                  <div class="skeleton h-4 w-full"></div>
                  <div class="skeleton h-10 w-full rounded-xl"></div>
                </div>
              }
            }
          </div>
        </section>
      } @else if (error()) {
        <app-error-state [message]="error()!" (retry)="load()" />
      } @else {
        @if (!isAdmin()) {
          <div class="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
            <section class="panel p-5 lg:p-8">
              <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 class="text-xl font-semibold text-ink">Create Outpass</h3>
                  <p class="mt-1 text-sm text-muted">A clean multi-section form designed for clarity and faster review.</p>
                </div>
                <label class="inline-flex items-center gap-3 rounded-2xl border border-border bg-stone-50 px-4 py-3 text-sm font-medium text-muted">
                  <input type="checkbox" [checked]="useProfile()" (change)="toggleUseProfile()" />
                  Use saved profile
                </label>
              </div>

              <form [formGroup]="form" (ngSubmit)="submit()" class="mt-6 grid gap-5">
                <section class="rounded-2xl border border-border bg-stone-50/60 p-5">
                  <h4 class="text-base font-semibold text-ink">Personal Info</h4>
                  <div class="mt-4 grid gap-3 text-sm text-ink sm:grid-cols-2">
                    <div><strong>Name:</strong> {{ auth.user()?.name || 'N/A' }}</div>
                    <div><strong>Register No:</strong> {{ auth.user()?.registerNo || 'N/A' }}</div>
                    <div><strong>Department:</strong> {{ auth.user()?.department || 'N/A' }}</div>
                    <div><strong>Block / Room:</strong> {{ auth.user()?.blockNo || 'N/A' }} / {{ auth.user()?.roomNo || 'N/A' }}</div>
                  </div>
                </section>

                <section class="rounded-2xl border border-border bg-white p-5">
                  <h4 class="text-base font-semibold text-ink">Outpass Details</h4>
                  <div class="mt-4 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label class="field-label">From Date</label>
                      <input class="field-input" [class.invalid]="form.controls.fromDate.invalid && form.controls.fromDate.touched" type="date" formControlName="fromDate" />
                      <app-form-error [control]="form.controls.fromDate" label="From date" />
                    </div>
                    <div>
                      <label class="field-label">To Date</label>
                      <input class="field-input" [class.invalid]="form.controls.toDate.invalid && form.controls.toDate.touched" type="date" formControlName="toDate" />
                      <app-form-error [control]="form.controls.toDate" label="To date" />
                      @if (form.errors?.['dateRange'] && (form.controls.fromDate.touched || form.controls.toDate.touched)) {
                        <p class="mt-2 text-sm text-danger">To date must be the same as or later than from date.</p>
                      }
                    </div>
                    <div>
                      <label class="field-label">Days</label>
                      <input class="field-input" [class.invalid]="form.controls.days.invalid && form.controls.days.touched" type="number" min="1" formControlName="days" />
                      <app-form-error [control]="form.controls.days" label="Days" />
                    </div>
                    <div>
                      <label class="field-label">Destination</label>
                      <input class="field-input" [class.invalid]="form.controls.destination.invalid && form.controls.destination.touched" type="text" formControlName="destination" placeholder="Destination or guardian address" />
                      <app-form-error [control]="form.controls.destination" label="Destination" />
                    </div>
                  </div>
                </section>

                <section class="rounded-2xl border border-border bg-white p-5">
                  <h4 class="text-base font-semibold text-ink">Reason</h4>
                  <div class="mt-4">
                    <label class="field-label">Purpose of leave</label>
                    <textarea class="field-input min-h-32" [class.invalid]="form.controls.reason.invalid && form.controls.reason.touched" formControlName="reason" placeholder="Share a clear and concise reason for the request."></textarea>
                    <app-form-error [control]="form.controls.reason" label="Reason" />
                  </div>
                </section>

                <div class="flex flex-col justify-end gap-3 sm:flex-row">
                  <button class="btn-outline w-full sm:w-auto" type="button" (click)="resetForm()">Reset</button>
                  <button class="btn-primary w-full sm:w-auto" type="submit" [disabled]="form.invalid">Submit Request</button>
                </div>
              </form>
            </section>

            <section class="grid gap-6">
              <article class="panel p-5 sm:p-6">
                <div class="flex items-center gap-3">
                  <div class="grid h-11 w-11 place-items-center rounded-2xl bg-stone-100 text-brand-600">
                    <app-icon name="qr" [size]="18" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-ink">QR Preview</h3>
                    <p class="text-sm text-muted">Visible once the request is approved.</p>
                  </div>
                </div>
                <div class="mt-5 grid min-h-[220px] place-items-center rounded-2xl border border-dashed border-border bg-stone-50 text-center text-sm text-muted">
                  Approved outpasses show a QR-backed PDF preview here.
                </div>
              </article>

              <article class="panel p-5 sm:p-6">
                <h3 class="text-lg font-semibold text-ink">How approval works</h3>
                <div class="mt-4 grid gap-3 text-sm leading-7 text-muted">
                  <div>1. Submit your request with valid dates and destination.</div>
                  <div>2. The admin reviews hostel details and travel context.</div>
                  <div>3. Approved requests become downloadable and QR-enabled.</div>
                </div>
              </article>
            </section>
          </div>
        } @else {
          <section class="panel p-5 sm:p-6">
            <div class="mb-5">
              <h3 class="text-xl font-semibold text-ink">Search & Filter</h3>
              <p class="mt-1 text-sm text-muted">A minimal inline filter bar for hostel-level request review.</p>
            </div>
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))_auto]">
              <div>
                <label class="field-label">Search</label>
                <input class="field-input" type="text" [(ngModel)]="filters.search" [ngModelOptions]="{ standalone: true }" placeholder="Name, register no, destination" />
              </div>
              <div>
                <label class="field-label">Block</label>
                <input class="field-input" type="text" [(ngModel)]="filters.blockNo" [ngModelOptions]="{ standalone: true }" />
              </div>
              <div>
                <label class="field-label">Room</label>
                <input class="field-input" type="text" [(ngModel)]="filters.roomNo" [ngModelOptions]="{ standalone: true }" />
              </div>
              <div>
                <label class="field-label">Department</label>
                <input class="field-input" type="text" [(ngModel)]="filters.department" [ngModelOptions]="{ standalone: true }" />
              </div>
              <div>
                <label class="field-label">Status</label>
                <select class="field-input" [(ngModel)]="filters.status" [ngModelOptions]="{ standalone: true }">
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div class="flex items-end">
                <button class="btn-primary w-full" type="button" (click)="load()">Apply</button>
              </div>
            </div>
          </section>
        }

        <section class="table-shell">
          <div class="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <h3 class="text-xl font-semibold text-ink">{{ isAdmin() ? 'Outpass Queue' : 'Outpass History' }}</h3>
            <p class="mt-1 text-sm text-muted">A compact review table with clear actions and minimal clutter.</p>
          </div>

          @if (outpasses().length) {
            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    @if (isAdmin()) {
                      <th>Name</th>
                      <th>Hostel</th>
                      <th>Department</th>
                    }
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of outpasses(); track item._id) {
                    <tr>
                      @if (isAdmin()) {
                        <td>{{ item.userId.name }}<div class="mt-1 text-xs text-muted">{{ item.userId.registerNo }}</div></td>
                        <td>{{ item.userId.blockNo }} / {{ item.userId.roomNo }}</td>
                        <td>{{ item.userId.department }}</td>
                      }
                      <td>{{ item.fromDate | date:'mediumDate' }}<div class="mt-1 text-xs text-muted">to {{ item.toDate | date:'mediumDate' }}</div></td>
                      <td>{{ item.reason }}</td>
                      <td><app-status-badge [status]="item.status" /></td>
                      <td>
                        <div class="flex flex-wrap gap-2">
                          @if (isAdmin() && item.status === 'pending') {
                            <button class="btn-secondary" type="button" (click)="updateStatus(item, 'approved')">Approve</button>
                            <button class="btn-danger" type="button" (click)="updateStatus(item, 'rejected')">Reject</button>
                          }
                          @if (item.status === 'approved') {
                            <button class="btn-primary" type="button" (click)="downloadPdf(item._id)">Download PDF</button>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="p-10 text-center text-sm text-muted">No outpass records match the current view.</div>
          }
        </section>
      }
    </app-layout-shell>
  `
})
export class OutpassComponent {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly outpassService = inject(OutpassService);
  private readonly toastService = inject(ToastService);

  readonly useProfile = signal(true);
  readonly outpasses = signal<Outpass[]>([]);
  readonly isAdmin = computed(() => this.auth.isAdmin());
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly form = this.fb.group(
    {
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      days: [1, [Validators.required, Validators.min(1)]],
      destination: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    },
    { validators: [dateRangeValidator()] }
  );
  readonly filters = {
    search: '',
    blockNo: '',
    roomNo: '',
    department: '',
    status: ''
  };

  constructor() {
    this.load();
  }

  toggleUseProfile(): void {
    this.useProfile.set(!this.useProfile());
  }

  resetForm(): void {
    this.form.reset({
      fromDate: '',
      toDate: '',
      days: 1,
      destination: '',
      reason: ''
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Please complete the outpass form before submitting.', 'error');
      return;
    }

    this.outpassService.create(this.form.getRawValue() as never).subscribe({
      next: ({ message }) => {
        this.toastService.show(message, 'success');
        this.resetForm();
        this.load();
      },
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to submit outpass'), 'error')
    });
  }

  load(): void {
    this.error.set(null);
    this.loading.set(true);
    this.outpassService.list(this.isAdmin() ? this.filters : {}).subscribe({
      next: (response) => {
        this.outpasses.set(response.outpasses);
        this.loading.set(false);
      },
      error: (error) => {
        const message = getErrorMessage(error, 'Unable to load outpasses');
        this.error.set(message);
        this.loading.set(false);
        this.toastService.show(message, 'error');
      }
    });
  }

  updateStatus(item: Outpass, status: 'approved' | 'rejected'): void {
    this.outpassService.updateStatus(item._id, status).subscribe({
      next: ({ message }) => {
        this.toastService.show(message, 'success');
        this.load();
      },
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to update outpass'), 'error')
    });
  }

  downloadPdf(id: string): void {
    this.outpassService.downloadPdf(id).subscribe({
      next: (blob) => {
        const fileUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `outpass-${id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(fileUrl);
      },
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to download PDF'), 'error')
    });
  }
}
