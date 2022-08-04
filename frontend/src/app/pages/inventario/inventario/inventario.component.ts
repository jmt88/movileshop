import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { CategoriaService } from '../../categoria/categoria.service';
import { ProductoService } from '../../producto/producto.service';
import { TiendaService } from '../../tienda/tienda.service';
import { InventarioFormComponent } from '../inventario-form/inventario-form.component';
import { InventarioService } from '../inventario.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
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
  tienda_id = "";
  producto_id = "";

  searchValue: any= "";
  login_user: any;

  tiendas: any [] = [];
  productos: any [] = [];
  formGroup!: FormGroup;
  
  constructor(private authService: AuthService, private inventarioService: InventarioService, 
    private errorService: ErrorService, private modal: NzModalService, private fb: FormBuilder,
    private viewContainerRef: ViewContainerRef, private cdr: ChangeDetectorRef, 
    private messageService: NzMessageService, private tiendaService: TiendaService, private productoService: ProductoService) {
        this.permisos = this.authService.canexecute('/inventarios');
        this.login_user = this.authService.getSessionUser();
  }
  
  
  inventarios: any[] = [];
  ngOnInit(): void {
    this.isLoading=true;
   this.listarInventarios();
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
    });
  }

  listarInventarios() {
      this.isLoading = true;
    this.inventarioService.listar(this.page, this.pageSize, this.orderKey, this.orderValue, this.searchKey).subscribe(data => {
      if(data.success) {
        this.inventarios = data.inventarios;
        this.ldapConfigurado = data.ldap;
        this.total = data.pagination.total;
        this.page = data.pagination.page;
        this.pageSize = data.pagination.pageSize;
        this.lastPage = data.pagination.lastPage;
      }
      this.isLoading = false;
    })
  }
  
  ventas(data: any) {
    this.mostrarModalVenta(data);
  }

  mostrarModalVenta(data: any) {
      const modal = this.modal.create({
        nzContent: InventarioFormComponent,
        nzViewContainerRef: this.viewContainerRef,
        nzKeyboard: false,
        nzMaskClosable: false,
        nzClosable: false,
        nzCentered: true,
        nzFooter: null,
        nzWidth: '35%',
        nzComponentParams: {
          id: data.id,
          permisosEntrada: this.rutas,
          precio_venta: data.precio_venta,
          existencia: data.existencia
        },
      });
      modal.afterClose.subscribe(data => {
        if(data.data) {
          this.listarInventarios();
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
   this.listarInventarios();
  }

  buscar(value:any = '') {
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
    
    this.listarInventarios();
  }
}
