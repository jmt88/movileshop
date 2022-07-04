import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from 'src/app/appConfig';
import { Observable } from 'rxjs';

interface Conexion {
  username: string;
  password: string;
  host: string;
  port: number;
  base_dn: string;
  source: string;
  timeout: number;
  usuarios: any [];
  networks: any [];
}

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) {}

  probarConexion(
    username: string,
    password: string,
    host: string,
    port: number,
    base_dn: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/probarCadenaConeccion`, {
      username: username,
      password: btoa(password),
      base_dn: base_dn,
      host: host,
      port: port,
    });
  }
  
  salvarConexion(
    datos: Conexion
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/salvarConfiguracion`, {
      username: datos.username,
      password: btoa( datos.password),
      base_dn:  datos.base_dn,
      host:  datos.host,
      port:  datos.port,
      source:  datos.source,
      timeout:  datos.timeout,
      usuarios: JSON.stringify( datos.usuarios),
      networks: JSON.stringify(datos.networks)
    });
  } 

  establecerComoRealizada() {
    return this.http.post<any>(`${this.apiUrl}/establecerComoRealizada`, {
     
    });
  }

}
