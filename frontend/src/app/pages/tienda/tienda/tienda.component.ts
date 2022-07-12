import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { TiendaFormComponent } from '../tienda-form/tienda-form.component';
import { TiendaService } from '../tienda.service';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss']
})
export class TiendaComponent implements OnInit {
  isLoading = false;
  disabled = true;
  
  permisos: any = null;

  rutas: any [] = [];
  modalVisible = false;
  ldapConfigurado = false;

  page = 1;
  pageSize = 10;
  lastPage = 1;
  total = 0;
  orderKey = 'nombre';
  orderValue = 'desc';
  
  searchKey: any[] = [];
  
  nombre = "";

  searchValue: any= "";

  
  constructor(private authService: AuthService, private tiendaService: TiendaService, 
    private errorService: ErrorService, private modal: NzModalService, 
    private viewContainerRef: ViewContainerRef, private cdr: ChangeDetectorRef, private messageService: NzMessageService) {
        this.permisos = this.authService.canexecute('/tiendas');
  }
  
  
  tiendas: any[] = [];
  ngOnInit(): void {
    this.isLoading=true;
   this.listarTiendas();
   this.tiendaService.listarTodosTiendas().subscribe(data => {
     if(data.success) {
       this.tiendas = data.tiendas;
       this.rutas = data.permiso;
     }
   })
  }

  listarTiendas() {
      this.isLoading = true;
    this.tiendaService.listar(this.page, this.pageSize, this.orderKey, this.orderValue, this.searchKey).subscribe(data => {
      if(data.success) {
        this.tiendas = data.tiendas;
        this.ldapConfigurado = data.ldap;
        this.total = data.pagination.total;
        this.page = data.pagination.page;
        this.pageSize = data.pagination.pageSize;
        this.lastPage = data.pagination.lastPage;
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
        nzContent: TiendaFormComponent,
        nzViewContainerRef: this.viewContainerRef,
        nzKeyboard: false,
        nzMaskClosable: false,
        nzClosable: false,
        nzCentered: true,
        nzFooter: null,
        nzWidth: '50%',
        nzComponentParams: {
          id: id,
          permisosEntrada: this.rutas
        },
      });
      modal.afterClose.subscribe(data => {
        if(data.data) {
          this.listarTiendas();
          
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
     this.tiendaService.eliminarTienda(id).subscribe(data=> {
       this.isLoading = false;
       if(data.success) {
         this.listarTiendas();
         this.messageService.success(data.message);
       }else {
         this.messageService.error(data.message);
       }
     });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    this.pageSize = pageSize;
    this.page = pageIndex;

    let find = true;
    sort.forEach((element) => {
      if (element.value) {
        find = false;
        this.orderKey = element.key;
        element.value === 'ascend'
          ? (this.orderValue = 'asc')
          : (this.orderValue = 'desc');
      }
    });
    if (find) {
      this.orderKey = 'nombre';
      this.orderValue = 'asc';
    }
   this.listarTiendas();
  }

  buscar(value:any) {
     this.searchKey = [];
    if(this.nombre != "") {
      this.searchKey.push(
        {
          key: 'nombre',
          value: this.nombre
        },
      );
    }
    
    this.listarTiendas();
  }
}
