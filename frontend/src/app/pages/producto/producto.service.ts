import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appConfig } from 'src/app/appConfig';

interface Producto {
  id?: any,
  nombre: any,
  descripcion: any,
  precio_venta: any,
  precio_compra: any,
  categoria: any,
  tienda: any,
  estado: boolean,
}
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) { }


  listar(page:number, pageSize:number, orderKey:string, orderValue:string, searchKey:any[]) {
    return this.http.post<any>(`${this.apiUrl}/listarProductos`, {
      page: page,
      pageSize:pageSize,
      orderKey: orderKey,
      orderValue:orderValue,
      searchKey: JSON.stringify(searchKey),
    });
  }

  cargarDatos(id: number) {
    return this.http.post<any>(`${this.apiUrl}/cargarDatosProducto`, {
      id: id
    });
  }

  adicionarProducto(producto: Producto) {
    return this.http.post<any>(`${this.apiUrl}/salvarProducto`, {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio_venta: producto.precio_venta,
      precio_compra: producto.precio_compra,
      estado: producto.estado,
    });
  }

  modificarProducto(producto: Producto) {
    return this.http.post<any>(`${this.apiUrl}/editarProducto`, {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio_venta: producto.precio_venta,
      precio_compra: producto.precio_compra,
      estado: producto.estado,
    });
  }
  
  eliminarProducto(id: number) {
    return this.http.post<any>(`${this.apiUrl}/eliminarProducto`, {
      id: id,
    });
  }
  
  listarTodosProductos() {
    return this.http.post<any>(`${this.apiUrl}/listarInformacionRequerida`, {
    });
  }
  

}
