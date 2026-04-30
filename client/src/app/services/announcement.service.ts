import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Announcement } from '../models/app.models';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private readonly http = inject(HttpClient);

  list() {
    return this.http.get<{ success?: boolean; announcements: Announcement[] }>(`${environment.apiUrl}/announcements`);
  }

  create(payload: {
    title: string;
    description: string;
    priority: 'normal' | 'important';
    expiryDate: string | null;
  }) {
    return this.http.post<{ success?: boolean; message: string; announcement: Announcement }>(
      `${environment.apiUrl}/announcements`,
      payload
    );
  }

  update(
    id: string,
    payload: {
      title: string;
      description: string;
      priority: 'normal' | 'important';
      expiryDate: string | null;
    }
  ) {
    return this.http.patch<{ success?: boolean; message: string; announcement: Announcement }>(
      `${environment.apiUrl}/announcements/${id}`,
      payload
    );
  }

  delete(id: string) {
    return this.http.delete<{ success?: boolean; message: string }>(`${environment.apiUrl}/announcements/${id}`);
  }
}
