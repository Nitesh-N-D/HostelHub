import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <section class="panel border-danger/20 bg-danger/5 p-6 text-center sm:p-8" role="alert">
      <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-danger/10 text-2xl text-danger">!</div>
      <h3 class="mt-4 text-lg font-semibold text-ink">Something needs attention</h3>
      <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">{{ message() }}</p>
      <button class="btn-outline mt-5" type="button" (click)="retry.emit()">Retry</button>
    </section>
  `
})
export class ErrorStateComponent {
  readonly message = input('Unable to load this section right now.');
  readonly retry = output<void>();
}
