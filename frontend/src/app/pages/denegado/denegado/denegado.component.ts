import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { DenegadoFormComponent } from '../denegado-form/denegado-form.component';
import { DenegadoService } from '../denegado.service';

@Component({
  selector: 'app-denegado',
  templateUrl: './denegado.component.html',
  styleUrls: ['./denegado.component.scss']
})
export class DenegadoComponent implements OnInit {
  isLoading = false;
  disabled = true;
  
  permisos: any = null;

  denegados: any [] = [];
  rutas: any [] = [];
  modalVisible = false;

  constructor(private authService: AuthService, private denegadoService: DenegadoService, 
    private errorService: ErrorService, private modal: NzModalService, 
    private viewContainerRef: ViewContainerRef, private cdr: ChangeDetectorRef, private messageService: NzMessageService) {
        this.permisos = this.authService.canexecute('/sitios-denegados');
        
    }
  
  
  ngOnInit(): void {
     this.listarDenegados();
  }

  listarDenegados() {
      this.isLoading = true;
    this.denegadoService.listar().subscribe(data => {
      if(data.success) {
        this.denegados = data.denegados;
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
        nzContent: DenegadoFormComponent,
        nzViewContainerRef: this.viewContainerRef,
        nzKeyboard: false,
        nzMaskClosable: false,
        nzClosable: false,
        nzCentered: true,
        nzFooter: null,
        nzWidth: '40%',
        nzComponentParams: {
          id: id,
        },
      });
      modal.afterClose.subscribe(data => {
        if(data.data) {
          this.listarDenegados();
        }
      });
  }

  mostrarModalEliminar(id:number) {
    this.modal.confirm({
      nzTitle: 'Eliminar Elemento',
      nzContent: 'Usted ha dispuesto eliminar el elemento. ¿Está seguro que desea eliminar el elemento ?',
      nzOkText: 'Eliminar',
      nzCancelText: 'Cancelar',
      nzOkDanger: true,
      nzOnOk: () => { this.eliminar(id)}
    })
  }

  eliminar(id: number) {
     this.isLoading = true;
     this.denegadoService.eliminarDenegado(id).subscribe(data=> {
       this.isLoading = false;
       if(data.success) {
         this.listarDenegados();
         this.messageService.success(data.message);
       }else {
         this.messageService.error(data.message);
       }
     });
  }

}
