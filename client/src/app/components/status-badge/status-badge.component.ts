import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span [class]="badgeClass()">{{ label() || status().replace('-', ' ') }}</span>`
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();
  readonly label = input<string>('');

  readonly badgeClass = computed(() => `status-badge status-${this.status()}`);
}
