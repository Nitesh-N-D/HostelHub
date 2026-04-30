import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent, LoadingSpinnerComponent],
  template: `
    <div class="app-shell">
      <router-outlet></router-outlet>
      <app-toast-container />
      <app-loading-spinner />
    </div>
  `
})
export class AppComponent {
  private readonly authService = inject(AuthService);

  constructor() {
    this.authService.restoreSession();
  }
}
