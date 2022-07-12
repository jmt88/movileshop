import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appConfig } from 'src/app/appConfig';

interface Categoria {
  id?: any,
  nombre: any,
  descripcion: any,
  estado: boolean,
}
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) { }


  listar(page:number, pageSize:number, orderKey:string, orderValue:string, searchKey:any[]) {
    return this.http.post<any>(`${this.apiUrl}/listarCategorias`, {
      page: page,
      pageSize:pageSize,
      orderKey: orderKey,
      orderValue:orderValue,
      searchKey: JSON.stringify(searchKey),
    });
  }

  cargarDatos(id: number) {
    return this.http.post<any>(`${this.apiUrl}/cargarDatosCategoria`, {
      id: id
    });
  }

  adicionarCategoria(categoria: Categoria) {
    return this.http.post<any>(`${this.apiUrl}/salvarCategoria`, {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      estado: categoria.estado,
    });
  }

  modificarCategoria(categoria: Categoria) {
    return this.http.post<any>(`${this.apiUrl}/editarCategoria`, {
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      estado: categoria.estado,
    });
  }
  
  eliminarCategoria(id: number) {
    return this.http.post<any>(`${this.apiUrl}/eliminarCategoria`, {
      id: id,
    });
  }
  
  listarTodosCategorias() {
    return this.http.post<any>(`${this.apiUrl}/listarInformacionRequerida`, {
    });
  }
  

}
