import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Complaint } from '../models/app.models';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private readonly http = inject(HttpClient);

  create(payload: { title: string; description: string }) {
    return this.http.post<{ success?: boolean; complaint: Complaint; message: string }>(
      `${environment.apiUrl}/complaints`,
      payload
    );
  }

  list() {
    return this.http.get<{ success?: boolean; complaints: Complaint[] }>(`${environment.apiUrl}/complaints`);
  }

  updateStatus(id: string, status: Complaint['status']) {
    return this.http.patch<{ success?: boolean; complaint: Complaint; message: string }>(
      `${environment.apiUrl}/complaints/${id}/status`,
      { status }
    );
  }

  delete(id: string) {
    return this.http.delete<{ success?: boolean; message: string }>(`${environment.apiUrl}/complaints/${id}`);
  }
}
