import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appConfig } from 'src/app/appConfig';

interface Producto {
  id?: any,
  codigo: any,
  nombre: any,
  descripcion: any,
  precio_venta: number,
  precio_compra: number,
  categoria: any,
  cantidad: number,
  existencia: number,
  estado: boolean,
}

interface Inventario {
  id?: any,
  producto: any,
  tienda: any,
  cantidad: any,
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
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio_venta: producto.precio_venta,
      precio_compra: producto.precio_compra,
      categoria: producto.categoria,
      existencia: producto.existencia,
      cantidad: producto.cantidad,
      estado: producto.estado,
    });
  }

  modificarProducto(producto: Producto) {
    return this.http.post<any>(`${this.apiUrl}/editarProducto`, {
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio_venta: producto.precio_venta,
      precio_compra: producto.precio_compra,
      categoria: producto.categoria,
      existencia: producto.existencia,
      cantidad: producto.cantidad,
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

  distribuirProducto(inventario: Inventario) {
    return this.http.post<any>(`${this.apiUrl}/distribuirProducto`, {
      producto: inventario.producto,
      tienda: inventario.tienda,
      cantidad: inventario.cantidad,
    });
  }
  
  recogerProducto(inventario: Inventario) {
    return this.http.post<any>(`${this.apiUrl}/distribuirProducto`, {
      producto: inventario.producto,
      tienda: inventario.tienda,
      cantidad: inventario.cantidad,
    });
  }
  

}
