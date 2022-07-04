import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConfig } from 'src/app/appConfig';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) { }

  listarConsumoCuotas() {
    return this.http.post<any>(`${this.apiUrl}/listarResumenConsumo`, {});
  }
}
