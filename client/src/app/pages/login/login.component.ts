import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { getErrorMessage } from '../../utils/api-error.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent],
  template: `
    <section class="page-shell grid min-h-screen bg-hero-glow lg:grid-cols-2">
      <div class="hidden bg-[linear-gradient(160deg,#171717_0%,#1f1f23_44%,#6d28d9_100%)] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div class="flex items-center gap-3">
          <div class="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-lg font-bold shadow-glow">H</div>
          <div>
            <div class="text-xl font-semibold">HostelHub</div>
            <div class="text-sm text-slate-300">University-grade hostel operations</div>
          </div>
        </div>

        <div class="max-w-xl">
          <h1 class="text-5xl font-bold tracking-tight">One place for outpasses, complaints, and hostel updates.</h1>
          <p class="mt-6 text-lg leading-8 text-slate-300">
            Students can submit requests faster, and admins can review, resolve, and announce updates from a cleaner daily workspace.
          </p>
          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            <div class="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <div class="text-sm font-semibold text-slate-200">Outpasses</div>
              <div class="mt-2 text-2xl font-bold">QR-Backed PDFs</div>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <div class="text-sm font-semibold text-slate-200">Complaints</div>
              <div class="mt-2 text-2xl font-bold">Structured Resolution</div>
            </div>
          </div>
        </div>

        <div class="text-sm text-slate-300">Trusted by modern university hostels</div>
      </div>

      <div class="flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div class="glass-card w-full max-w-2xl p-5 sm:p-8">
          <div class="mb-6 flex items-center gap-3 lg:hidden">
            <div class="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-sm font-bold text-white">H</div>
            <div>
              <div class="text-base font-semibold text-ink">HostelHub</div>
              <div class="text-xs text-muted">University-grade hostel operations</div>
            </div>
          </div>

          <div class="mb-6 grid gap-3 sm:hidden">
            @for (item of mobileHighlights; track item.title) {
              <article class="rounded-2xl border border-border bg-white/80 px-4 py-4 shadow-soft">
                <div class="text-sm font-semibold text-ink">{{ item.title }}</div>
                <div class="mt-1 text-sm text-muted">{{ item.description }}</div>
              </article>
            }
          </div>

          <div class="mb-6 grid gap-3 sm:grid-cols-2">
            <button class="btn-base w-full" [class]="mode() === 'login' ? 'btn-primary' : 'btn-outline'" (click)="mode.set('login')">Login</button>
            <button class="btn-base w-full" [class]="mode() === 'register' ? 'btn-primary' : 'btn-outline'" (click)="mode.set('register')">Register</button>
          </div>

          @if (mode() === 'login') {
            <div class="mb-6">
              <h2 class="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Welcome back</h2>
              <p class="mt-2 text-sm text-muted">Use your college or personal email to access HostelHub.</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="submitLogin()" class="grid gap-5">
              <div>
                <label class="field-label">Email</label>
                <input class="field-input" type="email" formControlName="email" placeholder="student@student.annauniv.edu" />
                <app-form-error [control]="loginForm.controls.email" label="Email" />
              </div>
              <div>
                <label class="field-label">Password</label>
                <input class="field-input" type="password" formControlName="password" placeholder="Enter your password" />
                <app-form-error [control]="loginForm.controls.password" label="Password" />
              </div>
              <button class="btn-primary w-full" type="submit" [disabled]="loginForm.invalid || submittingLogin()">
                @if (submittingLogin()) {
                  <span class="inline-flex items-center gap-2">
                    <span class="spinner-inline"></span>
                    Signing in
                  </span>
                } @else {
                  <span>Sign In</span>
                }
              </button>
            </form>
          } @else {
            <div class="mb-6">
              <h2 class="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Create your account</h2>
              <p class="mt-2 text-sm text-muted">Complete your profile once so requests and complaint flows are auto-filled later.</p>
            </div>

            <form [formGroup]="registerForm" (ngSubmit)="submitRegister()" class="grid gap-5 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label class="field-label">Full Name</label>
                <input class="field-input" type="text" formControlName="name" />
                <app-form-error [control]="registerForm.controls.name" label="Full name" />
              </div>
              <div>
                <label class="field-label">Email</label>
                <input class="field-input" type="email" formControlName="email" />
                <app-form-error [control]="registerForm.controls.email" label="Email" />
              </div>
              <div>
                <label class="field-label">Password</label>
                <input class="field-input" type="password" formControlName="password" />
                <app-form-error [control]="registerForm.controls.password" label="Password" />
              </div>
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
                <app-form-error [control]="registerForm.controls.mobile" label="Mobile number" />
              </div>
              <div>
                <label class="field-label">Parent Mobile</label>
                <input class="field-input" type="text" formControlName="parentMobile" />
                <app-form-error [control]="registerForm.controls.parentMobile" label="Parent mobile number" />
              </div>
              <div class="sm:col-span-2">
                <label class="field-label">Address</label>
                <textarea class="field-input min-h-28" formControlName="address"></textarea>
              </div>
              <button class="btn-primary w-full sm:col-span-2" type="submit" [disabled]="registerForm.invalid || submittingRegister()">
                @if (submittingRegister()) {
                  <span class="inline-flex items-center gap-2">
                    <span class="spinner-inline"></span>
                    Creating account
                  </span>
                } @else {
                  <span>Create Account</span>
                }
              </button>
            </form>
          }
        </div>
      </div>
    </section>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly mode = signal<'login' | 'register'>('login');
  readonly submittingLogin = signal(false);
  readonly submittingRegister = signal(false);
  readonly mobileHighlights = [
    { title: 'Request tracking', description: 'Outpasses, complaints, and announcements stay connected in one app.' },
    { title: 'Admin review', description: 'Wardens and admins can approve, resolve, and publish updates quickly.' }
  ];
  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  readonly registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    department: [''],
    course: [''],
    registerNo: [''],
    blockNo: [''],
    roomNo: [''],
    address: [''],
    mobile: ['', [Validators.pattern(/^[0-9]{10}$/)]],
    parentMobile: ['', [Validators.pattern(/^[0-9]{10}$/)]]
  });

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.show('Enter a valid email and password to continue.', 'error');
      return;
    }

    this.submittingLogin.set(true);
    this.authService.login(this.loginForm.getRawValue() as { email: string; password: string }).subscribe({
      next: ({ user, message }) => {
        this.submittingLogin.set(false);
        this.toastService.show(message, 'success');
        this.router.navigateByUrl(user.role === 'admin' ? '/admin' : '/dashboard');
      },
      error: (error) => {
        this.submittingLogin.set(false);
        this.toastService.show(getErrorMessage(error, 'Login failed'), 'error');
      }
    });
  }

  submitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastService.show('Please correct the highlighted registration fields.', 'error');
      return;
    }

    this.submittingRegister.set(true);
    this.authService.register(this.registerForm.getRawValue() as never).subscribe({
      next: ({ user, message }) => {
        this.submittingRegister.set(false);
        this.toastService.show(message, 'success');
        this.router.navigateByUrl(user.role === 'admin' ? '/admin' : '/dashboard');
      },
      error: (error) => {
        this.submittingRegister.set(false);
        this.toastService.show(getErrorMessage(error, 'Registration failed'), 'error');
      }
    });
  }
}
