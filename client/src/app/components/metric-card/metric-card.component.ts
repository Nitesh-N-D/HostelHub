import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [IconComponent],
  template: `
    <section class="panel panel-hover relative overflow-hidden p-5 sm:p-6">
      <div class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl"></div>
      <div class="relative flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-muted">{{ label() }}</p>
          <strong class="mt-2 block text-2xl font-bold tracking-tight text-ink sm:text-3xl">{{ value() }}</strong>
          @if (meta()) {
            <p class="mt-2 text-sm text-muted">{{ meta() }}</p>
          }
        </div>
        <div class="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
          <app-icon [name]="icon()" [size]="18" />
        </div>
      </div>
    </section>
  `
})
export class MetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly meta = input<string>('');
  readonly icon = input<string>('dashboard');
}
