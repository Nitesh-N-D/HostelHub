import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <footer class="mt-20 bg-neutral-950 text-neutral-300">
      <div class="section-shell py-14 grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">

        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3">
            <div class="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-sm font-bold text-white">
              H
            </div>
            <div>
              <div class="text-base font-semibold text-white">HostelHub</div>
              <div class="text-xs text-neutral-400">Smart hostel management</div>
            </div>
          </div>

          <p class="mt-4 max-w-sm text-sm leading-7 text-neutral-400">
            A modern platform to simplify hostel workflows—outpasses, complaints,
            announcements, and admin control—all in one place.
          </p>
        </div>

        <!-- Product -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Product
          </h4>
          <div class="mt-4 flex flex-col gap-3 text-sm">
            <a routerLink="/login" class="hover:text-white transition">Get Started</a>
            <a routerLink="/login" class="hover:text-white transition">Login</a>
            <a routerLink="/dashboard" class="hover:text-white transition">Dashboard</a>
          </div>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Contact
          </h4>
          <div class="mt-4 flex flex-col gap-3 text-sm">
            <a href="mailto:niteshdwaraka@gmail.com" class="hover:text-white transition">
              niteshdwaraka@gmail.com
            </a>
          </div>
        </div>

        <!-- Social -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Follow
          </h4>

          <div class="mt-4 flex gap-3">

            <!-- GitHub -->
            <a
              href="https://github.com/Nitesh-N-D"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              class="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition"
            >
              <app-icon name="github" [size]="16" />
            </a>

            <!-- LinkedIn -->
            <a
              href="https://www.linkedin.com/in/nitesh-n-d-249ab6325"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              class="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-[#0A66C2] transition"
            >
              <app-icon name="linkedin" [size]="16" />
            </a>

            <!-- Email -->
            <a
              href="mailto:niteshdwaraka@gmail.com"
              title="Email"
              class="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-red-400 transition"
            >
              <app-icon name="mail" [size]="16" />
            </a>

          </div>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10">
        <div class="section-shell py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs text-neutral-500">
          <span>© {{ year }} HostelHub. All rights reserved.</span>

          <div class="flex gap-4">
            <span class="hover:text-white transition cursor-pointer">Privacy</span>
            <span class="hover:text-white transition cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class LandingFooterComponent {
  year = new Date().getFullYear();
}