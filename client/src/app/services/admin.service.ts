import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminStats } from '../models/app.models';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getStats() {
    return this.http.get<AdminStats>(`${environment.apiUrl}/admin/stats`);
  }
}
