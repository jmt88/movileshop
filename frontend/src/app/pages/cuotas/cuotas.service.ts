import { Injectable } from '@angular/core';
import { appConfig } from '../../appConfig';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuotasService {
  apiUrl = appConfig.apiUrl
  constructor(private http: HttpClient) { }

  listarCuotas(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/listarCuotas`, {});
  }

  salvarCuotas(cuotas: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/salvarCuotas`, {
      cuotas: JSON.stringify(cuotas),
    });
  }
}
