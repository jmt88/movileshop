import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-importar-usuario',
  templateUrl: './importar-usuario.component.html',
  styleUrls: ['./importar-usuario.component.scss']
})
export class ImportarUsuarioComponent implements OnInit {
  
  listaUsuariosEntrada: any [] = [];
  listaUsuariosSalida: any [] = [];
  isLoading = false;
  mostrar = false;
  constructor(private errorService: ErrorService, private usuarioService: UsuarioService, private cdr: ChangeDetectorRef, private modalRef: NzModalRef) { 

  }

  ngOnInit(): void {
      this.isLoading = true;
      this.usuarioService.listarCuotas().subscribe(data=> {
        this.isLoading = false;
        if(data.success) {
            this.listaUsuariosEntrada = data.usuarios;

        }
        this.mostrar = true;
      });
      this.procesarError();
  }

  onChangeListaUsarios(e: any[]) {
    this.listaUsuariosSalida = e;
  }
  
  salvarCuotas() {
    this.isLoading = true;
    this.usuarioService.salvarCuotas(this.listaUsuariosSalida).subscribe(data=> {
      this.isLoading = false;
      if(data.success) {
        this.cerrarModal(true);
      }
    });
    this.procesarError();
  }

  cerrarModal(success: boolean) {
    this.modalRef.destroy({data: success});
  }

  procesarError() {
    this.errorService.getError().subscribe(e => {
       if(e) {
         this.isLoading = !e;
       }
     });
   }
}
