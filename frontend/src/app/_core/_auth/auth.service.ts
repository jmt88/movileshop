import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { appConfig } from './../../appConfig';

interface User {
  id?: number;
  nombre: string;
  username: string;
  email: string;
  password?: string;
}

interface Permiso {
  id?: number;
  nombre: string;
  metodo: string;
  descripcion?: string;
  grupo?: number;
  link: string;
  ver: boolean;
  crear: boolean;
  modificar: boolean;
  eliminar: boolean;
}


interface Session {
  email: string;
nombre: string;
perfil ?: string;
perfil_id?: string;
tienda_id?: string;
tienda?: string;
permisos: any[];
token: string;
usuario_id: string;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = appConfig.apiUrl;
  constructor(
    private http: HttpClient,
    private router: Router,
    private message: NzMessageService
  ) {}

  Login(username: string, password: string): Observable<any> {
    
    return this.http.post<any>(`${this.apiUrl}/login`, {
      username: username,
      password: btoa(password),
    });
  }
  setSession(s: string): void {
    sessionStorage.setItem('session', s);
  }

  getSessionUser() {
    const data = this.getSession();
    if(data) {
      return {
        email: data['email'],
        nombre: data['nombre'],
        perfil: data['perfil'],
        tienda: data['tienda'],
        tienda_id: data['tienda_id'],
        perfil_id: data['perfil_id'],
        usuario_id: data['usuario_id']
      }
    }
    return null;
  } 

  getSessionPermisos() {
    let s = sessionStorage.getItem('session');
    let result = [];
    if (s) {
      s = atob(s);
      const data = <Session>JSON.parse(s);
      result = data['permisos'];
    }
    return result;
  }

  getSession() {
    let s = sessionStorage.getItem('session');
    let result;
    if (s) {
      s = atob(s);
      const data = <Session>JSON.parse(s);
      result = data;
    }
    return result;
  }
  
  getSessionToken() {
    let s = sessionStorage.getItem('session');
    let result = '';
    if (s) {
      s = atob(s);
      const data = <Session>JSON.parse(s);
      result = data['token'];
    }
    return result;
  }
  
  isLogin(): boolean {
    if (sessionStorage.getItem('session')) {
      return true;
    }
    return false;
  }

  getPermisos() {
    return this.http.post<Permiso[]>(`${this.apiUrl}/rutes`, {});
  }

  getSidePerm() {
    let result: any[] = [];
    let perm = this.getSessionPermisos();
    perm.forEach((element) => {
      if (element.descripcion && element.crear === true) {
        result.push(element);
      }
    });
    return result;
  }

  canexecute(rute: string) {
    let perm = this.getSessionPermisos();
    let permisos = {
      ver: false,
      crear: false,
      modificar: false,
      eliminar: false,
    };

    perm.forEach((element) => {
      if (element.link === rute) {
        permisos.ver = element.ver;
        permisos.crear = element.crear;
        permisos.modificar = element.modificar;
        permisos.eliminar = element.eliminar;
      }
    });

    return permisos;
  }

  Logout(): void {

    this.http.post<string>(`${this.apiUrl}/logout`, {}).subscribe();
    sessionStorage.removeItem('session');
    this.router.navigate(['/auth/login']);
  }

  LogoutGuard(): void {
    sessionStorage.removeItem('session');
    this.router.navigate(['/auth/login']);
  }
}
