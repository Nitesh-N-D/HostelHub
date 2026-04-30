import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, DashboardResponse, User } from '../models/app.models';
import { environment } from '../environments/environment';
import { RealtimeService } from './realtime.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly realtimeService = inject(RealtimeService);
  readonly user = signal<User | null>(null);
  readonly token = signal<string | null>(localStorage.getItem('hostelhub_token'));

  restoreSession(): void {
    const storedUser = localStorage.getItem('hostelhub_user');
    if (storedUser) {
      this.user.set(JSON.parse(storedUser) as User);
    }
    if (this.token()) {
      this.realtimeService.connect(environment.apiUrl, this.token()!);
    }
  }

  register(payload: Partial<User> & { password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  getProfile() {
    return this.http.get<User>(`${environment.apiUrl}/auth/profile`);
  }

  updateProfile(payload: Partial<User> & { password?: string }) {
    return this.http.put<{ user: User; message: string }>(`${environment.apiUrl}/auth/profile`, payload).pipe(
      tap((response) => {
        this.user.set(response.user);
        localStorage.setItem('hostelhub_user', JSON.stringify(response.user));
      })
    );
  }

  getStudentDashboard() {
    return this.http.get<DashboardResponse>(`${environment.apiUrl}/auth/student-dashboard`);
  }

  persistSession(response: AuthResponse): void {
    this.token.set(response.token);
    this.user.set(response.user);
    localStorage.setItem('hostelhub_token', response.token);
    localStorage.setItem('hostelhub_user', JSON.stringify(response.user));
    this.realtimeService.connect(environment.apiUrl, response.token);
  }

  logout(): void {
    this.realtimeService.disconnect();
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem('hostelhub_token');
    localStorage.removeItem('hostelhub_user');
    this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  isAdmin(): boolean {
    return this.user()?.role === 'admin';
  }
}
