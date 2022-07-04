import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { PerfilFormComponent } from '../perfil-form/perfil-form.component';
import { PerfilService } from '../perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  isLoading = false;
  disabled = true;
  
  permisos: any = null;

  perfiles: any [] = [];
  rutas: any [] = [];
  modalVisible = false;

  constructor(private authService: AuthService, private perfilService: PerfilService, 
    private errorService: ErrorService, private modal: NzModalService, 
    private viewContainerRef: ViewContainerRef, private cdr: ChangeDetectorRef, private messageService: NzMessageService) {
        this.permisos = this.authService.canexecute('/perfiles');
        
    }
  
  
  ngOnInit(): void {
    this.isLoading=true;
   this.listarPerfiles();
   this.perfilService.listarTodosPerfiles().subscribe(data => {
     if(data.success) {
       this.perfiles = data.perfiles;
       this.rutas = data.permiso;
     }
   })
  }

  listarPerfiles() {
      this.isLoading = true;
    this.perfilService.listar().subscribe(data => {
      if(data.success) {
        this.perfiles = data.perfiles;
      }
      this.isLoading = false;
    })
  }
  
  editar(id:number) {

    this.mostrarModal(id);
  }

  adicionar() {
    this.mostrarModal();
  }

  mostrarModal(id?:number) {
      const modal = this.modal.create({
        nzContent: PerfilFormComponent,
        nzViewContainerRef: this.viewContainerRef,
        nzKeyboard: false,
        nzMaskClosable: false,
        nzClosable: false,
        nzCentered: true,
        nzFooter: null,
        nzWidth: '100%',
        nzComponentParams: {
          id: id,
          permisosEntrada: this.rutas
        },
      });
      modal.afterClose.subscribe(data => {
        if(data.data) {
          this.listarPerfiles();
          
        }
      });
  }

  mostrarModalEliminar(id:number) {
    this.modal.confirm({
      nzTitle: 'Eliminar Elemento',
      nzContent: 'Usted ha dispuesto eliminar el elemento. ¿Está seguro que desea eleminar el elemento ?',
      nzOkText: 'Eliminar',
      nzCancelText: 'Cancelar',
      nzOkDanger: true,
      nzOnOk: () => { this.eliminar(id)}
    })
  }

  eliminar(id: number) {
     this.isLoading = true;
     this.perfilService.eliminarPerfil(id).subscribe(data=> {
       this.isLoading = false;
       if(data.success) {
         this.listarPerfiles();
         this.messageService.success(data.message);
       }else {
         this.messageService.error(data.message);
       }
     });
  }

}
