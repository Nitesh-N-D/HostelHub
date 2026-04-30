import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { LayoutShellComponent } from '../../components/layout-shell/layout-shell.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { getErrorMessage } from '../../utils/api-error.util';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent, LayoutShellComponent],
  template: `
    <app-layout-shell
      title="Profile"
      [subtitle]="isAdmin() ? 'Manage your admin account and access details.' : 'Keep your student information accurate for autofill, approvals, and support workflows.'"
    >
      <div class="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section class="panel p-5 sm:p-6">
          <div class="flex items-center gap-4">
            <div class="grid h-16 w-16 place-items-center rounded-3xl bg-brand-gradient text-lg font-bold text-white shadow-glow">
              {{ initials }}
            </div>
            <div>
              <h3 class="text-xl font-semibold text-ink">{{ auth.user()?.name }}</h3>
              <p class="mt-1 text-sm text-muted">{{ auth.user()?.email }}</p>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <span class="status-badge status-in-progress">Role: {{ roleLabel() }}</span>
            @if (isAdmin()) {
              <span class="status-badge status-approved">Admin access</span>
            } @else {
              <span class="status-badge status-approved">Profile linked</span>
            }
          </div>

          <div class="mt-6 grid gap-3 text-sm text-ink">
            @if (isAdmin()) {
              <div><strong>Access:</strong> Hostel operations</div>
              <div><strong>Account:</strong> Managed admin login</div>
            } @else {
              <div><strong>Register No:</strong> {{ auth.user()?.registerNo || 'N/A' }}</div>
              <div><strong>Department:</strong> {{ auth.user()?.department || 'N/A' }}</div>
              <div><strong>Block / Room:</strong> {{ auth.user()?.blockNo || 'N/A' }} / {{ auth.user()?.roomNo || 'N/A' }}</div>
              <div><strong>Mobile:</strong> {{ auth.user()?.mobile || 'N/A' }}</div>
              <div><strong>Parent Mobile:</strong> {{ auth.user()?.parentMobile || 'N/A' }}</div>
            }
          </div>
        </section>

        <section class="panel p-5 sm:p-6">
          <div class="mb-5">
            <h3 class="text-xl font-semibold text-ink">Update Profile</h3>
            <p class="mt-1 text-sm text-muted">Changes here are reflected across outpass and complaint workflows.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="field-label">Name</label>
              <input class="field-input" type="text" formControlName="name" />
              <app-form-error [control]="form.controls.name" label="Name" />
            </div>
            @if (!isAdmin()) {
              <div>
                <label class="field-label">Department</label>
                <input class="field-input" type="text" formControlName="department" />
              </div>
              <div>
                <label class="field-label">Course</label>
                <input class="field-input" type="text" formControlName="course" />
              </div>
              <div>
                <label class="field-label">Register No</label>
                <input class="field-input" type="text" formControlName="registerNo" />
              </div>
              <div>
                <label class="field-label">Block No</label>
                <input class="field-input" type="text" formControlName="blockNo" />
              </div>
              <div>
                <label class="field-label">Room No</label>
                <input class="field-input" type="text" formControlName="roomNo" />
              </div>
              <div>
                <label class="field-label">Mobile</label>
                <input class="field-input" type="text" formControlName="mobile" />
                <app-form-error [control]="form.controls.mobile" label="Mobile number" />
              </div>
              <div>
                <label class="field-label">Parent Mobile</label>
                <input class="field-input" type="text" formControlName="parentMobile" />
                <app-form-error [control]="form.controls.parentMobile" label="Parent mobile number" />
              </div>
            }
            <div class="sm:col-span-2">
              <label class="field-label">Address</label>
              <textarea class="field-input min-h-28" formControlName="address"></textarea>
            </div>
            <div class="sm:col-span-2">
              <label class="field-label">New Password</label>
              <input class="field-input" type="password" formControlName="password" placeholder="Leave blank to keep your current password" />
            </div>
            <div class="sm:col-span-2 flex flex-col justify-end gap-3 sm:flex-row">
              <button class="btn-outline w-full sm:w-auto" type="button" (click)="reset()">Reset</button>
              <button class="btn-primary w-full sm:w-auto" type="submit" [disabled]="form.invalid || saving()">
                @if (saving()) {
                  <span class="inline-flex items-center gap-2">
                    <span class="spinner-inline"></span>
                    Saving
                  </span>
                } @else {
                  <span>Save Changes</span>
                }
              </button>
            </div>
          </form>
        </section>
      </div>
    </app-layout-shell>
  `
})
export class ProfileComponent {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly toastService = inject(ToastService);
  readonly isAdmin = computed(() => this.auth.user()?.role === 'admin');
  readonly roleLabel = computed(() => (this.isAdmin() ? 'Admin' : 'Student'));
  readonly saving = signal(false);

  readonly form = this.fb.group({
    name: [this.auth.user()?.name || '', Validators.required],
    department: [this.auth.user()?.department || ''],
    course: [this.auth.user()?.course || ''],
    registerNo: [this.auth.user()?.registerNo || ''],
    blockNo: [this.auth.user()?.blockNo || ''],
    roomNo: [this.auth.user()?.roomNo || ''],
    mobile: [this.auth.user()?.mobile || '', [Validators.pattern(/^[0-9]{10}$/)]],
    parentMobile: [this.auth.user()?.parentMobile || '', [Validators.pattern(/^[0-9]{10}$/)]],
    address: [this.auth.user()?.address || ''],
    password: ['']
  });

  get initials(): string {
    return (
      this.auth
        .user()
        ?.name.split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'HH'
    );
  }

  reset(): void {
    this.form.reset({
      name: this.auth.user()?.name || '',
      department: this.auth.user()?.department || '',
      course: this.auth.user()?.course || '',
      registerNo: this.auth.user()?.registerNo || '',
      blockNo: this.auth.user()?.blockNo || '',
      roomNo: this.auth.user()?.roomNo || '',
      mobile: this.auth.user()?.mobile || '',
      parentMobile: this.auth.user()?.parentMobile || '',
      address: this.auth.user()?.address || '',
      password: ''
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Please correct the invalid profile fields.', 'error');
      return;
    }

    const raw = this.form.getRawValue();
    this.saving.set(true);
    this.auth
      .updateProfile({
        name: raw.name || '',
        department: raw.department || '',
        course: raw.course || '',
        registerNo: raw.registerNo || '',
        blockNo: raw.blockNo || '',
        roomNo: raw.roomNo || '',
        mobile: raw.mobile || '',
        parentMobile: raw.parentMobile || '',
        address: raw.address || '',
        password: raw.password || undefined
      })
      .subscribe({
        next: ({ message }) => {
          this.saving.set(false);
          this.toastService.show(message, 'success');
        },
        error: (error) => {
          this.saving.set(false);
          this.toastService.show(getErrorMessage(error, 'Unable to update profile'), 'error');
        }
      });
  }
}
