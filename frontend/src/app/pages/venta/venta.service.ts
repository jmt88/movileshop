import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appConfig } from 'src/app/appConfig';

interface Venta {
  id?: any,
}
@Injectable({
  providedIn: 'root'
})
export class VentaService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) { }


  listar(page:number, pageSize:number, orderKey:string, orderValue:string, searchKey:any[]) {
    return this.http.post<any>(`${this.apiUrl}/listarVentas`, {
      page: page,
      pageSize:pageSize,
      orderKey: orderKey,
      orderValue:orderValue,
      searchKey: JSON.stringify(searchKey),
    });
  }

  cancelarVenta(id: number) {
    return this.http.post<any>(`${this.apiUrl}/cancelarVenta`, {
      id: id,
    });
  }
 
  aprobarVenta(id: number) {
    return this.http.post<any>(`${this.apiUrl}/aprobarVenta`, {
      id: id,
    });
  }
  
  eliminarVenta(id: number) {
    return this.http.post<any>(`${this.apiUrl}/eliminarVenta`, {
      id: id,
    });
  }

}
