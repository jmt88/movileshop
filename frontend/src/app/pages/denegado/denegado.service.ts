import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConfig } from 'src/app/appConfig';

interface Denegado {
  id?: any,
  sitio: any,
}
@Injectable({
  providedIn: 'root'
})
export class DenegadoService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) { }


  listar() {
    return this.http.post<any>(`${this.apiUrl}/listarDenegados`, {});
  }

  cargarDatos(id: number) {
    return this.http.post<any>(`${this.apiUrl}/cargarDatosDenegado`, {
      id: id
    });
  }

  adicionarDenegado(denegado: Denegado) {
    return this.http.post<any>(`${this.apiUrl}/salvarDenegado`, {
      sitio: denegado.sitio,
    });
  }

  modificarDenegado(denegado: Denegado) {
    return this.http.post<any>(`${this.apiUrl}/editarDenegado`, {
      id: denegado.id,
      sitio: denegado.sitio,
    });
  }
  
  eliminarDenegado(id: number) {
    return this.http.post<any>(`${this.apiUrl}/eliminarDenegado`, {
      id: id,
    });
  }

}
