import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConfig } from 'src/app/appConfig';

interface Perfil {
  id?: any,
  perfil: any,
  permisos: any[],
}
@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) { }


  listar() {
    return this.http.post<any>(`${this.apiUrl}/listarPerfiles`, {});
  }

  cargarDatos(id: number) {
    return this.http.post<any>(`${this.apiUrl}/cargarDatosPerfil`, {
      id: id
    });
  }

  adicionarPerfil(perfil: Perfil) {
    return this.http.post<any>(`${this.apiUrl}/salvarPerfil`, {
      perfil: perfil.perfil,
      permisos: JSON.stringify(perfil.permisos),
    });
  }

  modificarPerfil(perfil: Perfil) {
    return this.http.post<any>(`${this.apiUrl}/editarPerfil`, {
      id: perfil.id,
      perfil: perfil.perfil,
      permisos: JSON.stringify(perfil.permisos),
      
    });
  }
  
  eliminarPerfil(id: number) {
    return this.http.post<any>(`${this.apiUrl}/eliminarPerfil`, {
      id: id,
    });
  }
  
 
  listarTodosPerfiles() {
    return this.http.post<any>(`${this.apiUrl}/listarInformacionRequerida`, {});
  }
  
 


}
