import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { CuotasService } from '../cuotas.service';

@Component({
  selector: 'app-cuotas',
  templateUrl: './cuotas.component.html',
  styleUrls: ['./cuotas.component.scss']
})
export class CuotasComponent implements OnInit, AfterViewInit {

  cuotas: any [] = [];
  listadoUsuario: any [] = [];
  permisos: any = null;
  isLoading = false;
  mostrar = false;
  constructor(private cdr: ChangeDetectorRef, private authService: AuthService, private errorService: ErrorService , private messageService: NzMessageService, private cuotasService: CuotasService) {
    this.permisos = this.authService.canexecute('/autorizaciones-usuarios');
   }

  ngOnInit(): void {
    this.listarCuotas();
  }
  ngAfterViewInit(): void {
    this.listarCuotas();
  }
  listarCuotas() {
    this.isLoading = true;
    this.cuotasService.listarCuotas().subscribe(data => {
        this.isLoading = false;
        if(data.success) {
          this.cuotas = data.cuotas;
          this.listadoUsuario = data.usuarios;
          if(this.cuotas.length > 0 || this.listadoUsuario.length > 0) {
            this.mostrar = true;
          }
          console.log(this.cuotas);
          this.cdr.detectChanges();
        }      
    });
    this.procesarError();
  }

  onChangeCuotas(e: any[]) {
    this.cuotas = e;
  }

  salvarCuotas(){
    this.isLoading = true;
    this.cuotasService.salvarCuotas(this.cuotas).subscribe(data=>{
      this.isLoading = false;
        if(data.success){
          this.listarCuotas();
        }  
    });
    this.procesarError();
  }

  procesarError() {
    this.errorService.getError().subscribe(e => {
       if(e) {
         this.isLoading = !e;
       }
     });
   }
}
