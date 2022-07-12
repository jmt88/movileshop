import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { CategoriaFormComponent } from '../categoria-form/categoria-form.component';
import { CategoriaService } from '../categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {
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

  
  constructor(private authService: AuthService, private categoriaService: CategoriaService, 
    private errorService: ErrorService, private modal: NzModalService, 
    private viewContainerRef: ViewContainerRef, private cdr: ChangeDetectorRef, private messageService: NzMessageService) {
        this.permisos = this.authService.canexecute('/categorias');
  }
  
  
  categorias: any[] = [];
  ngOnInit(): void {
    this.isLoading=true;
   this.listarCategorias();
   this.categoriaService.listarTodosCategorias().subscribe(data => {
     if(data.success) {
       this.categorias = data.categorias;
       this.rutas = data.permiso;
     }
   })
  }

  listarCategorias() {
      this.isLoading = true;
    this.categoriaService.listar(this.page, this.pageSize, this.orderKey, this.orderValue, this.searchKey).subscribe(data => {
      if(data.success) {
        this.categorias = data.categorias;
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
        nzContent: CategoriaFormComponent,
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
          this.listarCategorias();
          
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
     this.categoriaService.eliminarCategoria(id).subscribe(data=> {
       this.isLoading = false;
       if(data.success) {
         this.listarCategorias();
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
   this.listarCategorias();
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
    
    this.listarCategorias();
  }
}
