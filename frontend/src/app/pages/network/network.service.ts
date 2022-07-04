import { Injectable } from '@angular/core';
import { appConfig } from '../../appConfig';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) { }

  listarNetworks(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/listarNetworks`, {});
  }

  salvarNetwork(host:string, internet:boolean): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/salvarNetwork`, {
      host:host,
      internet: internet
    });
  }
  
  editarNetwork(id:number, host:string, internet:boolean): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/editarNetwork`, {
      id:id,
      host:host,
      internet: internet
    });
  }
  
  eliminarNetwork(id:number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/eliminarNetwork`, {
      id:id,
    });
  }
  
  cargarDatosNetwork(id:number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cargarDatosNetwork`, {
      id:id,
    });
  }

}
