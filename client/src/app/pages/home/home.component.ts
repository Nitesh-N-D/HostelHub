import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { LandingFooterComponent } from '../../components/landing-footer/landing-footer.component';
import { LandingNavbarComponent } from '../../components/landing-navbar/landing-navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, IconComponent, LandingNavbarComponent, LandingFooterComponent],
  template: `
    <section class="page-shell overflow-hidden bg-hero-glow">
      <app-landing-navbar />

      <section class="section-shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.96fr] lg:py-24">
        <div class="flex max-w-2xl flex-col justify-center motion-fade-up">
          <span class="inline-flex w-fit items-center rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            HostelHub
          </span>
          <h1 class="mt-6 text-4xl font-semibold tracking-tight text-ink sm:text-5xl xl:text-7xl">
            Smarter hostel living starts here
          </h1>
          <p class="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Manage outpasses, complaints, announcements, and daily hostel communication from one clear, reliable workspace.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
            <a class="btn-primary w-full sm:w-auto" routerLink="/login">Get Started</a>
            <a class="btn-outline w-full sm:w-auto" href="#features">See Features</a>
          </div>

          <div class="mt-8 grid gap-3 sm:grid-cols-3">
            @for (signal of heroSignals; track signal.label) {
              <article class="rounded-2xl border border-border bg-white/80 p-4 shadow-soft">
                <p class="text-sm font-medium text-muted">{{ signal.label }}</p>
                <p class="mt-2 text-lg font-semibold text-ink">{{ signal.value }}</p>
              </article>
            }
          </div>
        </div>

        <div class="relative motion-fade-up motion-delay-2">
          <div class="absolute left-8 top-10 h-24 w-24 rounded-full bg-brand-500/10 blur-3xl"></div>
          <div class="absolute right-0 top-0 h-20 w-20 rounded-full bg-accent/15 blur-3xl"></div>

          <div class="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <article class="glass-card hero-float p-5 sm:p-6">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-medium text-muted">Daily hostel flow</p>
                  <h2 class="mt-2 text-2xl font-semibold tracking-tight text-ink">Clear routines. Less chasing.</h2>
                </div>
                <span class="status-badge status-approved">Live</span>
              </div>

              <div class="mt-6 grid gap-3">
                @for (item of dailyFlow; track item.title) {
                  <div class="rounded-2xl border border-border bg-white px-4 py-4 shadow-soft">
                    <div class="flex items-center justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-ink">{{ item.title }}</p>
                        <p class="mt-1 text-sm text-muted">{{ item.description }}</p>
                      </div>
                      <span class="status-badge {{ item.statusClass }}">{{ item.status }}</span>
                    </div>
                  </div>
                }
              </div>
            </article>

            <div class="grid gap-4">
              <article class="panel p-5">
                <p class="text-sm font-medium text-muted">Quote</p>
                <blockquote class="mt-3 text-lg font-semibold leading-8 text-ink">
                  "Morning approvals, room issues, and hostel notices now stay in one place."
                </blockquote>
                <p class="mt-4 text-sm text-muted">Used by wardens and students for everyday hostel coordination.</p>
              </article>

              <article class="panel p-5">
                <p class="text-sm font-medium text-muted">What stays visible</p>
                <div class="mt-4 grid gap-3">
                  @for (point of visibilityPoints; track point.title) {
                    <div class="rounded-2xl border border-border bg-stone-50/80 px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="grid h-9 w-9 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                          <app-icon [name]="point.icon" [size]="16" />
                        </div>
                        <div>
                          <p class="text-sm font-semibold text-ink">{{ point.title }}</p>
                          <p class="text-xs text-muted">{{ point.description }}</p>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="section-shell py-20">
        <div class="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <h2 class="text-3xl font-semibold tracking-tight text-ink lg:text-4xl">Built around hostel work</h2>
            <p class="mt-3 text-base leading-7 text-muted">Everything is arranged to reduce manual follow-up and make daily hostel tasks easier to scan.</p>
          </div>
        </div>

        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          @for (feature of features; track feature.title) {
            <article class="panel panel-hover motion-fade-up rounded-xl p-6">
              <div class="grid h-12 w-12 place-items-center rounded-2xl bg-stone-100 text-brand-600">
                <app-icon [name]="feature.icon" [size]="18" />
              </div>
              <h3 class="mt-5 text-lg font-semibold text-ink">{{ feature.title }}</h3>
              <p class="mt-2 text-sm leading-7 text-muted">{{ feature.description }}</p>
            </article>
          }
        </div>
      </section>

      <section id="workflow" class="section-shell py-20">
        <div class="mb-10 max-w-2xl">
          <h2 class="text-3xl font-semibold tracking-tight text-ink lg:text-4xl">How it works</h2>
          <p class="mt-3 text-base leading-7 text-muted">A simple flow from request to approval without the paper queue feeling.</p>
        </div>

        <div class="grid gap-4 lg:grid-cols-4">
          @for (step of steps; track step.title; let index = $index) {
            <div class="relative">
              <article class="panel rounded-xl p-6">
                <div class="flex items-center gap-3">
                  <div class="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-sm font-semibold text-white">
                    {{ index + 1 }}
                  </div>
                  <app-icon [name]="step.icon" [size]="18" />
                </div>
                <h3 class="mt-5 text-lg font-semibold text-ink">{{ step.title }}</h3>
                <p class="mt-2 text-sm leading-7 text-muted">{{ step.description }}</p>
              </article>
              @if (index < steps.length - 1) {
                <div class="absolute right-[-10px] top-1/2 hidden h-px w-5 bg-border lg:block"></div>
              }
            </div>
          }
        </div>
      </section>

      <section id="announcements" class="section-shell py-20">
        <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <h2 class="text-3xl font-semibold tracking-tight text-ink lg:text-4xl">Announcements preview</h2>
            <p class="mt-3 text-base leading-7 text-muted">Important hostel updates stay visible, readable, and easy to check on any device.</p>
          </div>
          <a class="btn-outline w-fit" routerLink="/login">Open App</a>
        </div>

        <div class="flex gap-4 overflow-x-auto pb-2">
          @for (announcement of announcementPreview; track announcement.title) {
            <article
              class="panel panel-hover min-w-[260px] rounded-xl p-5 sm:min-w-[300px] sm:p-6"
              [class.border-[#d2b08f]]="announcement.priority === 'important'"
            >
              <div class="flex items-center justify-between gap-3">
                <span class="status-badge {{ announcement.priority === 'important' ? 'status-pending' : 'status-in-progress' }}">
                  {{ announcement.priority }}
                </span>
                <span class="text-xs text-muted">{{ announcement.date }}</span>
              </div>
              <h3 class="mt-4 text-lg font-semibold text-ink">{{ announcement.title }}</h3>
              <p class="mt-2 text-sm leading-7 text-muted">{{ announcement.description }}</p>
            </article>
          }
        </div>
      </section>

      <section class="section-shell py-20">
        <div class="rounded-[28px] border border-border bg-cta-gradient px-5 py-8 shadow-panel sm:px-8 sm:py-10 lg:flex lg:items-center lg:justify-between">
          <div class="max-w-2xl">
            <h2 class="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Bring order to hostel routines</h2>
            <p class="mt-3 text-sm leading-7 text-muted sm:text-base">
              Reduce missed follow-ups, keep notices in view, and let students and admins work from the same clear system.
            </p>
          </div>
          <a class="btn-primary mt-6 w-full lg:mt-0 lg:w-auto" routerLink="/login">Get Started</a>
        </div>
      </section>

      <app-landing-footer />
    </section>
  `
})
export class HomeComponent {
  readonly heroSignals = [
    { label: 'Outpass workflow', value: 'Requests, approvals, and PDF passes' },
    { label: 'Issue tracking', value: 'Complaint updates with clear status flow' },
    { label: 'Notice board', value: 'Important announcements kept in view' }
  ];

  readonly dailyFlow = [
    {
      title: 'Gate pass review',
      description: 'Today\'s requests are grouped with status and destination details.',
      status: 'Pending',
      statusClass: 'status-in-progress'
    },
    {
      title: 'Room maintenance',
      description: 'Complaint updates stay visible until the issue is completed.',
      status: 'In progress',
      statusClass: 'status-pending'
    },
    {
      title: 'Notice board',
      description: 'Important announcements remain highlighted for students.',
      status: 'Updated',
      statusClass: 'status-approved'
    }
  ];

  readonly visibilityPoints = [
    { icon: 'outpass', title: 'Outpasses', description: 'Dates, reasons, and approvals in one place.' },
    { icon: 'complaint', title: 'Complaints', description: 'A clean queue for room and hostel issues.' },
    { icon: 'announcement', title: 'Announcements', description: 'Important updates stay easy to notice.' }
  ];

  readonly features = [
    {
      icon: 'outpass',
      title: 'Outpass requests',
      description: 'Students submit leave requests while admins review, approve, and issue downloadable passes.'
    },
    {
      icon: 'complaint',
      title: 'Complaint desk',
      description: 'Track room and hostel issues with clear statuses and cleaner follow-up.'
    },
    {
      icon: 'qr',
      title: 'QR verification',
      description: 'Approved outpasses include verifiable QR-backed PDFs for smoother gate checks.'
    },
    {
      icon: 'dashboard',
      title: 'Admin control',
      description: 'See approvals, complaints, and occupancy trends from one reliable dashboard.'
    }
  ];

  readonly steps = [
    { icon: 'profile', title: 'Register', description: 'Create a student profile once for smoother autofill and approvals.' },
    { icon: 'outpass', title: 'Request', description: 'Submit dates, destination, and reason through a structured form.' },
    { icon: 'check', title: 'Approve', description: 'Admins review each request and update the decision from the queue.' },
    { icon: 'download', title: 'Download', description: 'Approved outpasses are ready to download with QR verification.' }
  ];

  readonly announcementPreview = [
    {
      title: 'Weekend gate timing update',
      description: 'Return timing for weekend outpasses has been revised for all hostel blocks.',
      priority: 'important',
      date: 'Today'
    },
    {
      title: 'Mess feedback review',
      description: 'Suggestions for next week\'s hostel committee review are open until Friday evening.',
      priority: 'normal',
      date: 'Yesterday'
    },
    {
      title: 'Water supply maintenance',
      description: 'Scheduled maintenance will affect Block B on Sunday morning. Please plan ahead.',
      priority: 'important',
      date: '2 days ago'
    }
  ];
}
