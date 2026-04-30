import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.viewBox]="'0 0 24 24'"
      [style.width.px]="size()"
      [style.height.px]="size()"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      aria-hidden="true"
    >
      <ng-container [ngSwitch]="name()">
        <ng-container *ngSwitchCase="'dashboard'">
          <path d="M3 13h8V3H3z"></path><path d="M13 21h8v-6h-8z"></path><path d="M13 3h8v8h-8z"></path><path d="M3 21h8v-4H3z"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'outpass'">
          <path d="M14 3h7v7"></path><path d="m10 14 11-11"></path><path d="M21 14v7h-7"></path><path d="m3 10 11 11"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'complaint'">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'announcement'">
          <path d="M3 11v2"></path><path d="M6 8v8"></path><path d="M20 6 8.5 10.5"></path><path d="M20 18 8.5 13.5"></path><path d="M8.5 10.5v3"></path><path d="M6 16a4 4 0 0 0 4 4h1"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'profile'">
          <path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle>
        </ng-container>
        <ng-container *ngSwitchCase="'menu'">
          <path d="M4 12h16"></path><path d="M4 6h16"></path><path d="M4 18h16"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'search'">
          <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'bell'">
          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5"></path><path d="M10 21a2 2 0 0 0 4 0"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'logout'">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><path d="m16 17 5-5-5-5"></path><path d="M21 12H9"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'calendar'">
          <path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'download'">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path><path d="M12 15V3"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'check'">
          <path d="m20 6-11 11-5-5"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'clock'">
          <circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'qr'">
          <path d="M3 3h7v7H3z"></path><path d="M14 3h7v7h-7z"></path><path d="M3 14h7v7H3z"></path><path d="M14 14h3v3h-3z"></path><path d="M18 18h3v3h-3z"></path><path d="M18 14h3"></path><path d="M14 18h3"></path>
        </ng-container>
        <ng-container *ngSwitchCase="'sparkles'">
          <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"></path><path d="M5 17l.9 2.1L8 20l-2.1.9L5 23l-.9-2.1L2 20l2.1-.9z"></path><path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z"></path>
        </ng-container>
        <ng-container *ngSwitchDefault>
          <circle cx="12" cy="12" r="8"></circle>
        </ng-container>
      </ng-container>
    </svg>
  `
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input(18);
}
