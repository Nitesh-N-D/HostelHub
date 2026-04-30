import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <footer class="mt-16 bg-neutral-900 py-14 text-neutral-200 sm:mt-20">
      <div class="section-shell grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div class="flex items-center gap-3">
            <div class="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-sm font-bold text-white">H</div>
            <div>
              <div class="text-base font-semibold text-white">HostelHub</div>
              <div class="text-xs text-neutral-400">For smoother hostel routines</div>
            </div>
          </div>
          <p class="mt-4 max-w-sm text-sm leading-7 text-neutral-400">
            Built for hostels that want cleaner communication, quicker approvals, and fewer manual follow-ups.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">Product</h4>
          <div class="mt-4 grid gap-3 text-sm text-neutral-300">
            <a routerLink="/login">Get Started</a>
            <a routerLink="/login">Login</a>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">Contact</h4>
          <div class="mt-4 grid gap-3 text-sm text-neutral-300">
            <span>support@hostelhub.app</span>
            <span>University Partner Desk</span>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">Follow</h4>
          <div class="mt-4 flex gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5">
              <app-icon name="announcement" [size]="16" />
            </span>
            <span class="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5">
              <app-icon name="dashboard" [size]="16" />
            </span>
            <span class="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5">
              <app-icon name="profile" [size]="16" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class LandingFooterComponent {}
