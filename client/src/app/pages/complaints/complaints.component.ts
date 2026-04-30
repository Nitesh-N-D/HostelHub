import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateComponent } from '../../components/error-state/error-state.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { LayoutShellComponent } from '../../components/layout-shell/layout-shell.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { Complaint } from '../../models/app.models';
import { AuthService } from '../../services/auth.service';
import { ComplaintService } from '../../services/complaint.service';
import { ToastService } from '../../services/toast.service';
import { getErrorMessage } from '../../utils/api-error.util';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorStateComponent,
    FormErrorComponent,
    LayoutShellComponent,
    StatusBadgeComponent
  ],
  template: `
    <app-layout-shell
      [title]="isAdmin() ? 'Complaint Desk' : 'Complaints'"
      [subtitle]="isAdmin() ? 'A minimal issue queue for tracking, updating, and resolving hostel complaints.' : 'Raise issues with clarity and follow the resolution progress.'"
    >
      @if (loading()) {
        @if (!isAdmin()) {
          <section class="skeleton-card">
            <div class="skeleton h-6 w-40"></div>
            <div class="mt-3 skeleton h-3 w-56"></div>
            <div class="mt-5 grid gap-5">
              <div>
                <div class="skeleton h-4 w-28"></div>
                <div class="mt-3 skeleton h-11 w-full rounded-xl"></div>
              </div>
              <div>
                <div class="skeleton h-4 w-24"></div>
                <div class="mt-3 skeleton h-32 w-full rounded-xl"></div>
              </div>
              <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <div class="skeleton h-11 w-full rounded-xl sm:w-24"></div>
                <div class="skeleton h-11 w-full rounded-xl sm:w-40"></div>
              </div>
            </div>
          </section>
        }

        <section class="table-shell">
          <div class="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <div class="skeleton h-6 w-40"></div>
            <div class="mt-3 skeleton h-3 w-56"></div>
          </div>
          <div class="space-y-4 p-4 sm:p-6">
            @for (row of [1, 2, 3, 4]; track row) {
              @if (isAdmin()) {
                <div class="grid gap-3 sm:grid-cols-6">
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
          <section class="panel p-5 lg:p-8">
            <div class="mb-5">
              <h3 class="text-xl font-semibold text-ink">Raise a Complaint</h3>
              <p class="mt-1 text-sm text-muted">Describe the issue clearly so the hostel office can respond faster.</p>
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-5">
              <div>
                <label class="field-label">Complaint Title</label>
                <input class="field-input" [class.invalid]="form.controls.title.invalid && form.controls.title.touched" type="text" formControlName="title" placeholder="Example: Water leakage in room" />
                <app-form-error [control]="form.controls.title" label="Complaint title" />
              </div>
              <div>
                <label class="field-label">Description</label>
                <textarea class="field-input min-h-32" [class.invalid]="form.controls.description.invalid && form.controls.description.touched" formControlName="description" placeholder="Describe the issue, urgency, and room context."></textarea>
                <app-form-error [control]="form.controls.description" label="Description" />
              </div>
              <div class="flex flex-col justify-end gap-3 sm:flex-row">
                <button class="btn-outline w-full sm:w-auto" type="button" (click)="form.reset()">Reset</button>
                <button class="btn-primary w-full sm:w-auto" type="submit" [disabled]="form.invalid">Submit Complaint</button>
              </div>
            </form>
          </section>
        }

        <section class="table-shell">
          <div class="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <h3 class="text-xl font-semibold text-ink">{{ isAdmin() ? 'Complaint Queue' : 'Your Complaints' }}</h3>
            <p class="mt-1 text-sm text-muted">List and table cues combined into one lightweight review surface.</p>
          </div>

          @if (complaints().length) {
            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    @if (isAdmin()) {
                      <th>Student</th>
                      <th>Hostel</th>
                    }
                    <th>Issue</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of complaints(); track item._id) {
                    <tr>
                      @if (isAdmin()) {
                        <td>{{ item.userId.name }}<div class="mt-1 text-xs text-muted">{{ item.userId.email }}</div></td>
                        <td>{{ item.userId.blockNo }} / {{ item.userId.roomNo }}</td>
                      }
                      <td>
                        <div class="font-medium text-ink">{{ item.title }}</div>
                        <div class="mt-1 text-xs leading-6 text-muted">{{ item.description }}</div>
                      </td>
                      <td><app-status-badge [status]="item.status" /></td>
                      <td>{{ item.createdAt | date:'mediumDate' }}</td>
                      <td>
                        @if (isAdmin()) {
                          <div class="flex flex-wrap gap-2">
                            <select class="field-input max-w-[170px]" [(ngModel)]="item.status" [ngModelOptions]="{ standalone: true }">
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button class="btn-secondary" type="button" (click)="update(item)">Save</button>
                            <button class="btn-danger" type="button" (click)="remove(item)">Delete</button>
                          </div>
                        } @else {
                          <span class="text-sm text-muted">Awaiting admin action</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="p-10 text-center text-sm text-muted">No complaint records found.</div>
          }
        </section>
      }
    </app-layout-shell>
  `
})
export class ComplaintsComponent {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly complaintService = inject(ComplaintService);
  private readonly toastService = inject(ToastService);

  readonly isAdmin = computed(() => this.auth.isAdmin());
  readonly complaints = signal<Complaint[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', [Validators.required, Validators.minLength(12)]]
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.error.set(null);
    this.loading.set(true);
    this.complaintService.list().subscribe({
      next: (response) => {
        this.complaints.set(response.complaints);
        this.loading.set(false);
      },
      error: (error) => {
        const message = getErrorMessage(error, 'Unable to load complaints');
        this.error.set(message);
        this.loading.set(false);
        this.toastService.show(message, 'error');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Please complete the complaint form before submitting.', 'error');
      return;
    }

    this.complaintService.create(this.form.getRawValue() as never).subscribe({
      next: ({ message }) => {
        this.toastService.show(message, 'success');
        this.form.reset();
        this.load();
      },
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to submit complaint'), 'error')
    });
  }

  update(item: Complaint): void {
    this.complaintService.updateStatus(item._id, item.status).subscribe({
      next: ({ message }) => {
        this.toastService.show(message, 'success');
        this.load();
      },
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to update complaint'), 'error')
    });
  }

  remove(item: Complaint): void {
    this.complaintService.delete(item._id).subscribe({
      next: ({ message }) => {
        this.toastService.show(message, 'success');
        this.load();
      },
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to delete complaint'), 'error')
    });
  }
}
