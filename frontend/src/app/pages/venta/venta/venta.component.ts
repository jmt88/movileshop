import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { VentaService } from '../venta.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss']
})
export class VentaComponent implements OnInit {
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
  orderKey = 'id';
  orderValue = 'desc';
  
  searchKey: any[] = [];
  
  codigo = "";

  searchValue: any= "";

  
  constructor(private authService: AuthService, private ventaService: VentaService, 
    private errorService: ErrorService, private modal: NzModalService, 
    private viewContainerRef: ViewContainerRef, private cdr: ChangeDetectorRef, private messageService: NzMessageService) {
        this.permisos = this.authService.canexecute('/ventas');
  }
  
  
  ventas: any[] = [];
  ngOnInit(): void {
    this.isLoading=true;
    this.listarVentas();
  }

  listarVentas() {
      this.isLoading = true;
    this.ventaService.listar(this.page, this.pageSize, this.orderKey, this.orderValue, this.searchKey).subscribe(data => {
      if(data.success) {
        this.ventas = data.ventas;
        this.ldapConfigurado = data.ldap;
        this.total = data.pagination.total;
        this.page = data.pagination.page;
        this.pageSize = data.pagination.pageSize;
        this.lastPage = data.pagination.lastPage;
      }
      this.isLoading = false;
    })
  }
  
  cancelarVenta(id: number) {
    this.mostrarModalCancelarVenta(id);
  }

  mostrarModalCancelarVenta(id:number) {
    this.modal.confirm({
      nzTitle: 'Cancelar Venta',
      nzContent: 'Está seguro que desea cancelar la venta seleccionada?',
      nzOkText: 'Aceptar',
      nzCancelText: 'Cancelar',
      nzOkDanger: true,
      nzOnOk: () => { this.cancelar(id)}
    })
  }

  cancelar(id: number) {
    this.isLoading = true;
    this.ventaService.cancelarVenta(id).subscribe(data=> {
      this.isLoading = false;
      if(data.success) {
        this.listarVentas();
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
      this.orderKey = 'id';
      this.orderValue = 'asc';
    }
   this.listarVentas();
  }

  buscar(value:any) {
     this.searchKey = [];
    if(this.codigo != "") {
      this.searchKey.push(
        {
          key: 'codigo',
          value: this.codigo
        },
      );
    }
    
    this.listarVentas();
  }
}
