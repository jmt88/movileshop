import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appConfig } from 'src/app/appConfig';

interface Tienda {
  id?: any,
  nombre: any,
  estado: boolean,
}
@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) { }


  listar(page:number, pageSize:number, orderKey:string, orderValue:string, searchKey:any[]) {
    return this.http.post<any>(`${this.apiUrl}/listarTiendas`, {
      page: page,
      pageSize:pageSize,
      orderKey: orderKey,
      orderValue:orderValue,
      searchKey: JSON.stringify(searchKey),
    });
  }

  cargarDatos(id: number) {
    return this.http.post<any>(`${this.apiUrl}/cargarDatosTienda`, {
      id: id
    });
  }

  adicionarTienda(tienda: Tienda) {
    return this.http.post<any>(`${this.apiUrl}/salvarTienda`, {
      nombre: tienda.nombre,
      estado: tienda.estado,
    });
  }

  modificarTienda(tienda: Tienda) {
    return this.http.post<any>(`${this.apiUrl}/editarTienda`, {
      id: tienda.id,
      nombre: tienda.nombre,
      estado: tienda.estado,
    });
  }
  
  eliminarTienda(id: number) {
    return this.http.post<any>(`${this.apiUrl}/eliminarTienda`, {
      id: id,
    });
  }
  
  listarTodosTiendas() {
    return this.http.post<any>(`${this.apiUrl}/listarInformacionRequerida`, {
    });
  }
  

}
