import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appConfig } from 'src/app/appConfig';

interface Tienda {
  id?: any,
  nombre: any,
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

  adicionarTienda(usuario: Tienda) {
    return this.http.post<any>(`${this.apiUrl}/salvarTienda`, {
      nombre: usuario.nombre,
    });
  }

  modificarTienda(usuario: Tienda) {
    return this.http.post<any>(`${this.apiUrl}/editarTienda`, {
      id: usuario.id,
      nombre: usuario.nombre,
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
