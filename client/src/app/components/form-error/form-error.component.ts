import { AbstractControl } from '@angular/forms';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-form-error',
  standalone: true,
  template: `
    @if (message()) {
      <p class="mt-2 text-sm text-danger">{{ message() }}</p>
    }
  `
})
export class FormErrorComponent {
  readonly control = input<AbstractControl | null>(null);
  readonly label = input('This field');

  readonly message = computed(() => {
    const control = this.control();
    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.label()} is required.`;
    }

    if (control.errors['email']) {
      return 'Enter a valid email address.';
    }

    if (control.errors['minlength']) {
      return `${this.label()} must be at least ${control.errors['minlength'].requiredLength} characters.`;
    }

    if (control.errors['pattern']) {
      if (this.label().toLowerCase().includes('mobile')) {
        return `${this.label()} must be exactly 10 digits.`;
      }
      return `${this.label()} format is invalid.`;
    }

    if (control.errors['min']) {
      return `${this.label()} must be at least ${control.errors['min'].min}.`;
    }

    if (control.errors['dateRange']) {
      return 'To date must be the same as or later than from date.';
    }

    return `${this.label()} is invalid.`;
  });
}
