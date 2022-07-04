import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConfig } from 'src/app/appConfig';

@Injectable({
  providedIn: 'root'
})
export class InspeccionService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) { }

  reporteGeneral(page:number, pageSize:number, orderKey:string, orderValue:string, searchKey:any[], filter:any) {
    return this.http.post<any>(`${this.apiUrl}/reporteGeneral`, {
      page: page,
      pageSize:pageSize,
      orderKey: orderKey,
      orderValue:orderValue,
      searchKey: JSON.stringify(searchKey),
      filter: JSON.stringify(filter)
    });
  }
}
