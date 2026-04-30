import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateComponent } from '../../components/error-state/error-state.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { LayoutShellComponent } from '../../components/layout-shell/layout-shell.component';
import { Announcement } from '../../models/app.models';
import { AnnouncementService } from '../../services/announcement.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { getErrorMessage } from '../../utils/api-error.util';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorStateComponent, FormErrorComponent, LayoutShellComponent],
  template: `
    <app-layout-shell
      [title]="isAdmin() ? 'Announcements' : 'Hostel Announcements'"
      [subtitle]="isAdmin() ? 'Publish and maintain notices in a clean communication workspace.' : 'Browse hostel updates in a clear, card-based feed.'"
    >
      @if (loading()) {
        @if (isAdmin()) {
          <section class="skeleton-card">
            <div class="skeleton h-6 w-44"></div>
            <div class="mt-3 skeleton h-3 w-60"></div>
            <div class="mt-5 grid gap-5 md:grid-cols-2">
              <div class="md:col-span-2">
                <div class="skeleton h-4 w-20"></div>
                <div class="mt-3 skeleton h-11 w-full rounded-xl"></div>
              </div>
              <div class="md:col-span-2">
                <div class="skeleton h-4 w-28"></div>
                <div class="mt-3 skeleton h-28 w-full rounded-xl"></div>
              </div>
              <div>
                <div class="skeleton h-4 w-16"></div>
                <div class="mt-3 skeleton h-11 w-full rounded-xl"></div>
              </div>
              <div>
                <div class="skeleton h-4 w-24"></div>
                <div class="mt-3 skeleton h-11 w-full rounded-xl"></div>
              </div>
              <div class="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <div class="skeleton h-11 w-full rounded-xl sm:w-24"></div>
                <div class="skeleton h-11 w-full rounded-xl sm:w-40"></div>
              </div>
            </div>
          </section>
        }

        <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          @for (item of [1, 2, 3, 4, 5, 6]; track item) {
            <article class="skeleton-card">
              <div class="flex items-center justify-between gap-3">
                <div class="skeleton h-7 w-24 rounded-full"></div>
                <div class="skeleton h-3 w-20"></div>
              </div>
              <div class="mt-4 skeleton h-5 w-2/3"></div>
              <div class="mt-3 skeleton h-3 w-full"></div>
              <div class="mt-2 skeleton h-3 w-5/6"></div>
              <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div class="skeleton h-3 w-28"></div>
                @if (isAdmin()) {
                  <div class="flex flex-col gap-2 sm:flex-row">
                    <div class="skeleton h-10 w-full rounded-xl sm:w-16"></div>
                    <div class="skeleton h-10 w-full rounded-xl sm:w-20"></div>
                  </div>
                }
              </div>
            </article>
          }
        </section>
      } @else if (error()) {
        <app-error-state [message]="error()!" (retry)="load()" />
      } @else {
        @if (isAdmin()) {
          <section class="panel p-5 lg:p-8">
            <div class="mb-5">
              <h3 class="text-xl font-semibold text-ink">{{ editingId() ? 'Edit Announcement' : 'Create Announcement' }}</h3>
              <p class="mt-1 text-sm text-muted">Keep notices concise, readable, and easy for students to scan.</p>
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-5 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="field-label">Title</label>
                <input class="field-input" [class.invalid]="form.controls.title.invalid && form.controls.title.touched" type="text" formControlName="title" />
                <app-form-error [control]="form.controls.title" label="Title" />
              </div>
              <div class="md:col-span-2">
                <label class="field-label">Description</label>
                <textarea class="field-input min-h-28" [class.invalid]="form.controls.description.invalid && form.controls.description.touched" formControlName="description"></textarea>
                <app-form-error [control]="form.controls.description" label="Description" />
              </div>
              <div>
                <label class="field-label">Priority</label>
                <select class="field-input" formControlName="priority">
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                </select>
              </div>
              <div>
                <label class="field-label">Expiry Date</label>
                <input class="field-input" type="date" formControlName="expiryDate" />
              </div>
              <div class="md:col-span-2 flex flex-col justify-end gap-3 sm:flex-row">
                <button class="btn-outline w-full sm:w-auto" type="button" (click)="resetForm()">Reset</button>
                <button class="btn-primary w-full sm:w-auto" type="submit" [disabled]="form.invalid">
                  {{ editingId() ? 'Update Announcement' : 'Publish Announcement' }}
                </button>
              </div>
            </form>
          </section>
        }

        <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          @for (announcement of announcements(); track announcement._id) {
            <article class="panel panel-hover rounded-xl p-6" [class.border-[#d2b08f]]="announcement.priority === 'important'">
              <div class="flex items-center justify-between gap-3">
                <span class="status-badge {{ announcement.priority === 'important' ? 'status-pending' : 'status-in-progress' }}">
                  {{ announcement.priority }}
                </span>
                <span class="text-xs text-muted">{{ announcement.createdAt | date:'mediumDate' }}</span>
              </div>
              <h3 class="mt-4 text-lg font-semibold text-ink">{{ announcement.title }}</h3>
              <p class="mt-2 text-sm leading-7 text-muted">{{ announcement.description }}</p>
              <div class="mt-5 flex flex-col gap-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                <span>Expiry: {{ announcement.expiryDate ? (announcement.expiryDate | date:'mediumDate') : 'No expiry' }}</span>
                @if (isAdmin()) {
                  <div class="flex flex-col gap-2 sm:flex-row">
                    <button class="btn-secondary" type="button" (click)="startEdit(announcement)">Edit</button>
                    <button class="btn-danger" type="button" (click)="remove(announcement._id)">Delete</button>
                  </div>
                }
              </div>
            </article>
          } @empty {
            <div class="panel p-10 text-center text-sm text-muted md:col-span-2 xl:col-span-3">
              No announcements available right now.
            </div>
          }
        </section>
      }
    </app-layout-shell>
  `
})
export class AnnouncementsComponent {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly announcementService = inject(AnnouncementService);
  private readonly toastService = inject(ToastService);

  readonly announcements = signal<Announcement[]>([]);
  readonly isAdmin = computed(() => this.auth.isAdmin());
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly editingId = signal<string | null>(null);
  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', [Validators.required, Validators.minLength(12)]],
    priority: ['normal' as 'normal' | 'important', Validators.required],
    expiryDate: ['']
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.error.set(null);
    this.loading.set(true);
    this.announcementService.list().subscribe({
      next: (response) => {
        this.announcements.set(response.announcements);
        this.loading.set(false);
      },
      error: (error) => {
        const message = getErrorMessage(error, 'Unable to load announcements');
        this.error.set(message);
        this.loading.set(false);
        this.toastService.show(message, 'error');
      }
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form.reset({ title: '', description: '', priority: 'normal', expiryDate: '' });
  }

  startEdit(announcement: Announcement): void {
    this.editingId.set(announcement._id);
    this.form.reset({
      title: announcement.title,
      description: announcement.description,
      priority: announcement.priority,
      expiryDate: announcement.expiryDate ? announcement.expiryDate.slice(0, 10) : ''
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Please complete the announcement form.', 'error');
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      title: raw.title || '',
      description: raw.description || '',
      priority: raw.priority || 'normal',
      expiryDate: raw.expiryDate || null
    };

    const request = this.editingId()
      ? this.announcementService.update(this.editingId()!, payload)
      : this.announcementService.create(payload);

    request.subscribe({
      next: ({ message }) => {
        this.toastService.show(message, 'success');
        this.resetForm();
        this.load();
      },
      error: (error) =>
        this.toastService.show(
          getErrorMessage(error, this.editingId() ? 'Unable to update announcement' : 'Unable to create announcement'),
          'error'
        )
    });
  }

  remove(id: string): void {
    this.announcementService.delete(id).subscribe({
      next: ({ message }) => {
        this.toastService.show(message, 'success');
        this.load();
      },
      error: (error) => this.toastService.show(getErrorMessage(error, 'Unable to delete announcement'), 'error')
    });
  }
}
