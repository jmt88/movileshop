import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appConfig } from 'src/app/appConfig';

interface Inventario {
  id?: any,
  producto_id: any,
  cantidad: number,
}
@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) { }


  listar(page:number, pageSize:number, orderKey:string, orderValue:string, searchKey:any[]) {
    return this.http.post<any>(`${this.apiUrl}/listarInventarios`, {
      page: page,
      pageSize:pageSize,
      orderKey: orderKey,
      orderValue:orderValue,
      searchKey: JSON.stringify(searchKey),
    });
  }

  ventaInventario(inventario: Inventario) {
    return this.http.post<any>(`${this.apiUrl}/ventaInventario`, {
      producto_id: inventario.producto_id,
      cantidad: inventario.cantidad,
    });
  }

}
