import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    @if (loadingService.activeRequests() > 0) {
      <div class="spinner-overlay p-4 sm:p-6">
        <div class="section-shell flex min-h-screen items-start pt-10 sm:pt-16">
          <div class="grid w-full gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div class="hidden rounded-[28px] border border-border bg-[#1c1c1e]/95 p-4 shadow-soft lg:block">
              <div class="skeleton h-12 w-36 rounded-2xl bg-white/10"></div>
              <div class="mt-8 grid gap-3">
                @for (item of [1, 2, 3, 4, 5]; track item) {
                  <div class="skeleton h-12 w-full rounded-2xl bg-white/10"></div>
                }
              </div>
              <div class="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div class="skeleton h-10 w-full rounded-2xl bg-white/10"></div>
                <div class="skeleton mt-3 h-10 w-full rounded-2xl bg-white/10"></div>
              </div>
            </div>

            <div class="rounded-[28px] border border-border bg-white/80 p-4 shadow-soft sm:p-6">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div class="skeleton h-6 w-40"></div>
                  <div class="skeleton mt-3 h-3 w-64"></div>
                </div>
                <div class="skeleton h-12 w-full rounded-2xl sm:w-40"></div>
              </div>

              <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                @for (item of [1, 2, 3, 4]; track item) {
                  <div class="skeleton-card">
                    <div class="skeleton h-4 w-24"></div>
                    <div class="skeleton mt-4 h-9 w-20"></div>
                    <div class="skeleton mt-3 h-3 w-32"></div>
                  </div>
                }
              </div>

              <div class="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div class="skeleton-card">
                  <div class="skeleton h-5 w-44"></div>
                  <div class="skeleton mt-3 h-3 w-60"></div>
                  <div class="mt-6 grid gap-4">
                    @for (item of [1, 2, 3]; track item) {
                      <div class="rounded-2xl border border-border bg-stone-50/70 p-5">
                        <div class="flex items-start justify-between gap-4">
                          <div class="flex-1">
                            <div class="skeleton h-4 w-40"></div>
                            <div class="skeleton mt-3 h-3 w-28"></div>
                            <div class="skeleton mt-4 h-3 w-full"></div>
                            <div class="skeleton mt-2 h-3 w-4/5"></div>
                          </div>
                          <div class="skeleton h-10 w-10 rounded-2xl"></div>
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <div class="grid gap-6">
                  @for (item of [1, 2]; track item) {
                    <div class="skeleton-card">
                      <div class="skeleton h-5 w-40"></div>
                      <div class="skeleton mt-3 h-3 w-52"></div>
                      <div class="skeleton mt-6 h-24 w-full rounded-2xl"></div>
                      <div class="skeleton mt-3 h-24 w-full rounded-2xl"></div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class LoadingSpinnerComponent {
  readonly loadingService = inject(LoadingService);
}
