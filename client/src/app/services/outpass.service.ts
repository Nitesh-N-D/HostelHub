import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Outpass } from '../models/app.models';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class OutpassService {
  private readonly http = inject(HttpClient);

  create(payload: {
    fromDate: string;
    toDate: string;
    days: number;
    reason: string;
    destination: string;
  }) {
    return this.http.post<{ success?: boolean; outpass: Outpass; message: string }>(
      `${environment.apiUrl}/outpasses`,
      payload
    );
  }

  list(filters?: Record<string, string>) {
    let params = new HttpParams();
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });

    return this.http.get<{ success?: boolean; outpasses: Outpass[] }>(`${environment.apiUrl}/outpasses`, { params });
  }

  updateStatus(id: string, status: 'approved' | 'rejected') {
    return this.http.patch<{ success?: boolean; outpass: Outpass; message: string }>(
      `${environment.apiUrl}/outpasses/${id}/status`,
      { status }
    );
  }

  getPdfUrl(id: string): string {
    return `${environment.apiUrl}/outpasses/${id}/pdf`;
  }

  downloadPdf(id: string) {
    return this.http.get(`${environment.apiUrl}/outpasses/${id}/pdf`, {
      responseType: 'blob'
    });
  }
}
