import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-landing-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <header class="sticky top-0 z-30 transition-all duration-300">
      <div class="section-shell pt-5">
        <nav
          class="flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300 sm:px-5 sm:py-4"
          [class]="scrolled() ? 'border-border bg-white/80 shadow-panel backdrop-blur-sm' : 'border-transparent bg-transparent'"
        >
          <a routerLink="/" class="flex items-center gap-3">
            <div class="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-sm font-bold text-white">H</div>
            <div>
              <div class="text-base font-semibold text-ink">HostelHub</div>
              <div class="text-xs text-muted">Hostel operations platform</div>
            </div>
          </a>

          <div class="hidden items-center gap-8 md:flex">
            <a href="#features" class="text-sm text-muted transition hover:text-ink">Features</a>
            <a href="#workflow" class="text-sm text-muted transition hover:text-ink">How It Works</a>
            <a href="#announcements" class="text-sm text-muted transition hover:text-ink">Announcements</a>
            <a routerLink="/login" class="btn-outline">Login</a>
          </div>

          <button class="btn-outline px-3 md:hidden" type="button" (click)="menuOpen.set(!menuOpen())" aria-label="Toggle navigation">
            <app-icon name="menu" [size]="16" />
          </button>
        </nav>

        @if (menuOpen()) {
          <div class="mt-3 rounded-2xl border border-border bg-white p-4 shadow-panel md:hidden">
            <div class="grid gap-3">
              <a href="#features" class="text-sm text-muted">Features</a>
              <a href="#workflow" class="text-sm text-muted">How It Works</a>
              <a href="#announcements" class="text-sm text-muted">Announcements</a>
              <a routerLink="/login" class="btn-primary w-full">Login</a>
            </div>
          </div>
        }
      </div>
    </header>
  `
})
export class LandingNavbarComponent {
  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }
}
