import { Component, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../_auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  display = false;
  perfil!:any;
  email!: any;
  nombre!: any;
  iniciales !: string;
  fecha = new Date();
  constructor(private authService: AuthService) { 
    this.perfil = this.authService.getSession()?.perfil;
    this.email = this.authService.getSession()?.email;
    this.nombre = this.authService.getSession()?.nombre;
    this.iniciales = this.optenerInicialesNombre(this.nombre);
  }

    ngOnInit() {
      setInterval(() => {
 
        this.fecha = new Date();
   
      }, 1000);
    }

    logout() {
      this.authService.Logout();
    }

    optenerInicialesNombre(data: string) {
       let aux = '';
       let contador = 0; 
       for (let index = 0; index < data.length; index++) {
         const element = data[index];
         
         if(element != " " && contador<2) {
           aux =aux + element.toUpperCase();
           contador++;
         }
       }
       return aux;
    }
}
