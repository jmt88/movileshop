import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { ProductoService } from '../../producto/producto.service';
import { TiendaService } from '../../tienda/tienda.service';
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
  login_user: any;

  searchValue: any= "";
  tiendas: any [] = [];
  productos: any [] = [];

  tienda_id = "";
  producto_id = "";
  fecha_inicial = "";
  fecha_final = "";
  formGroup!: FormGroup;
  
  constructor(private authService: AuthService, private ventaService: VentaService, private productoService: ProductoService,
    private errorService: ErrorService, private modal: NzModalService, private fb: FormBuilder, private tiendaService: TiendaService,
    private viewContainerRef: ViewContainerRef, private cdr: ChangeDetectorRef, private messageService: NzMessageService) {
        this.permisos = this.authService.canexecute('/ventas');
        this.login_user = this.authService.getSessionUser();
  }
  
  ventas: any[] = [];
  ngOnInit(): void {
    this.isLoading=true;
    this.listarVentas();
    this.listarVentas();
   this.tiendaService.listarTodosTiendas().subscribe(data => {
     if(data.success) {
       this.tiendas = data.tiendas;
     }
   })
   this.productoService.listarTodosProductos().subscribe(data => {
     if(data.success) {
       this.productos = data.productos;
     }
   })
    this.crearFormulario();
  }

  crearFormulario() {
    this.formGroup = this.fb.group({
      tienda_id: [''],
      producto_id: [''],
      fecha_inicial: [''],
      fecha_final: [''],
    });
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
  
 aprobarVenta(id: number) {
    this.mostrarModalAprobarVenta(id);
  }

  mostrarModalAprobarVenta(id:number) {
    this.modal.confirm({
      nzTitle: 'Aprobar Venta',
      nzContent: 'Está seguro que desea aprobar la venta seleccionada?',
      nzOkText: 'Aceptar',
      nzCancelText: 'Cancelar',
      nzOkDanger: true,
      nzOnOk: () => { this.aprobar(id)}
    })
  }

  aprobar(id: number) {
    this.isLoading = true;
    this.ventaService.aprobarVenta(id).subscribe(data=> {
      this.isLoading = false;
      if(data.success) {
        this.listarVentas();
        this.messageService.success(data.message);
      }else {
        this.messageService.error(data.message);
      }
    });
 }

 mostrarModalEliminar(id:number) {
  this.modal.confirm({
    nzTitle: 'Eliminar Elemento',
    nzContent: '¿Está seguro que desea eliminar el elemento ?',
    nzOkText: 'Eliminar',
    nzCancelText: 'Cancelar',
    nzOkDanger: true,
    nzOnOk: () => { this.eliminar(id)}
  })
}

eliminarVenta(id: number) {
  this.mostrarModalEliminar(id);
}

eliminar(id: number) {
   this.isLoading = true;
   this.ventaService.eliminarVenta(id).subscribe(data=> {
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

    this.tienda_id = this.formGroup.controls['tienda_id'].value;
    if(this.tienda_id != "" && this.tienda_id != null) {
      this.searchKey.push(
        {
          key: 'tienda_id',
          value: this.tienda_id
        },
      );
    }
    
    this.producto_id = this.formGroup.controls['producto_id'].value;
    if(this.producto_id != "" && this.producto_id != null) {
      this.searchKey.push(
        {
          key: 'producto_id',
          value: this.producto_id
        },
      );
    }
    
    this.fecha_inicial = this.formGroup.controls['fecha_inicial'].value;
    if(this.fecha_inicial != "" && this.fecha_inicial != null) {
      this.searchKey.push(
        {
          key: 'fecha_inicial',
          value: this.fecha_inicial
        },
      );
    }

    this.fecha_final = this.formGroup.controls['fecha_final'].value;
    if(this.fecha_final != "" && this.fecha_final != null) {
      this.searchKey.push(
        {
          key: 'fecha_final',
          value: this.fecha_final
        },
      );
    }
    
    this.listarVentas();
  }
}
