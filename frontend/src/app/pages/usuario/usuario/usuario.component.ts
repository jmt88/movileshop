import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { ImportarUsuarioComponent } from '../importar-usuario/importar-usuario.component';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  isLoading = false;
  disabled = true;
  
  permisos: any = null;

  perfiles: any [] = [];
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
  username = "";
  email = "";

  searchValue: any= "";

  
  constructor(private authService: AuthService, private usuarioService: UsuarioService, 
    private errorService: ErrorService, private modal: NzModalService, 
    private viewContainerRef: ViewContainerRef, private cdr: ChangeDetectorRef, private messageService: NzMessageService) {
        this.permisos = this.authService.canexecute('/usuarios');
        
     }
  
  
  usuarios: any[] = [];
  ngOnInit(): void {
    this.isLoading=true;
   this.listarUsuarios();
   this.usuarioService.listarTodosUsuarios().subscribe(data => {
     if(data.success) {
       this.perfiles = data.perfiles;
       this.rutas = data.permiso;
     }
   })
  }

  listarUsuarios() {
      this.isLoading = true;
    this.usuarioService.listar(this.page, this.pageSize, this.orderKey, this.orderValue, this.searchKey).subscribe(data => {
      if(data.success) {
        this.usuarios = data.usuarios;
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
        nzContent: UsuarioFormComponent,
        nzViewContainerRef: this.viewContainerRef,
        nzKeyboard: false,
        nzMaskClosable: false,
        nzClosable: false,
        nzCentered: true,
        nzFooter: null,
        nzWidth: '100%',
        nzComponentParams: {
          id: id,
          perfiles: this.perfiles,
          permisosEntrada: this.rutas
        },
      });
      modal.afterClose.subscribe(data => {
        if(data.data) {
          this.listarUsuarios();
          
        }
      });
  }
  
  
  mostrarModalImportarUsuarios() {
      const modal = this.modal.create({
        nzContent: ImportarUsuarioComponent,
        nzViewContainerRef: this.viewContainerRef,
        nzKeyboard: false,
        nzMaskClosable: false,
        nzClosable: false,
        nzCentered: true,
        nzFooter: null,
        nzWidth: '100%',
        nzComponentParams: {
        },
      });
      modal.afterClose.subscribe(data => {
        if(data.data) {
          this.listarUsuarios();
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
     this.usuarioService.eliminarUsuario(id).subscribe(data=> {
       this.isLoading = false;
       if(data.success) {
         this.listarUsuarios();
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
   this.listarUsuarios();
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
    
    if(this.username != "") {
      this.searchKey.push(
        {
          key: 'username',
          value: this.username
        },
      );
    }
    if(this.email != "") {
      this.searchKey.push(
        {
          key: 'email',
          value: this.email
        },
      );
    }

    this.listarUsuarios();
  }
}
