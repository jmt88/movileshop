import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appConfig } from 'src/app/appConfig';

interface Usuario {
  id?: any,
  nombre: any,
  usuario: any,
  email: any,
  perfil: any,
  password: any,
  permisos: any[],
  internet: any,
  navegacion: any,
  cuota?: any
}
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) { }


  listar(page:number, pageSize:number, orderKey:string, orderValue:string, searchKey:any[]) {
    return this.http.post<any>(`${this.apiUrl}/listarUsuarios`, {
      page: page,
      pageSize:pageSize,
      orderKey: orderKey,
      orderValue:orderValue,
      searchKey: JSON.stringify(searchKey),
    });
  }

  cargarDatos(id: number) {
    return this.http.post<any>(`${this.apiUrl}/cargarDatosUsuario`, {
      id: id
    });
  }

  adicionarUsuario(usuario: Usuario) {
    return this.http.post<any>(`${this.apiUrl}/salvarUsuario`, {
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      email: usuario.email,
      perfil: usuario.perfil,
      password: btoa(usuario.password),
      permisos: JSON.stringify(usuario.permisos),
      internet: usuario.internet,
      navegacion: usuario.navegacion,
      cuota: usuario.cuota
    });
  }

  modificarUsuario(usuario: Usuario) {
    return this.http.post<any>(`${this.apiUrl}/editarUsuario`, {
      id: usuario.id,
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      email: usuario.email,
      perfil: usuario.perfil,
      password: btoa(usuario.password),
      permisos: JSON.stringify(usuario.permisos),
      internet: usuario.internet,
      navegacion: usuario.navegacion,
      cuota: usuario.cuota
    });
  }
  
  eliminarUsuario(id: number) {
    return this.http.post<any>(`${this.apiUrl}/eliminarUsuario`, {
      id: id,
    });
  }
  
 
  listarTodosUsuarios() {
    return this.http.post<any>(`${this.apiUrl}/listarInformacionRequerida`, {
     
    });
  }
  
  listarCuotas(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/listarCuotas`, {});
  }

  salvarCuotas(cuotas: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/salvarCuotas`, {
      cuotas: JSON.stringify(cuotas),
    });
  }

}
