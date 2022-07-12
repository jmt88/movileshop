import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { FormNetworkComponent } from './form-network/form-network.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NetworkService } from '../../network/network.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.scss'],
})
export class NetworksComponent implements OnInit {
  @Input() hostList: any[] = [];
  @Input() local: boolean = true;
  @Output() onListChange = new EventEmitter<any[]>();
  hosts: any[] = [];
  isLoading = false;

  permisos!: any;
  constructor(
    private authService: AuthService,
    private modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private messageService: NzMessageService,
    private networkService: NetworkService,
    private errorService: ErrorService
  ) {
    this.permisos = this.authService.canexecute('/autorizaciones-ip');
  }

  ngOnInit(): void {
    if (this.local) {
      this.hosts = this.hostList;
    } else {
      this.listarHost();
    }
  }

  addToList(data?: any) {
    
    if(!this.existeIp(data.host, data.posicion)) {
      this.hosts = [
        ...this.hosts,
        {
          id: '',
          host: data.host,
          internet: data.internet,
          posicion: this.hosts.length,
        },
      ];
      this.onListChange.emit(this.hosts);
    }else {
      this.messageService.error('El host introducido ya se encuentra registrado por favor ingrese otro');
      this.mostrarModal(data);
    }
  }

  editList(data: any) {
    if(!this.existeIp(data.host, data.posicion)) {
      this.hosts[data.posicion].id = data.id;
      this.hosts[data.posicion].host = data.host;
      this.hosts[data.posicion].internet = data.internet;
      this.hosts[data.posicion].posicion = data.posicion;
      this.onListChange.emit(this.hosts);
    }else {
      this.messageService.error('El host introducido ya se encuentra registrado por favor ingrese otro');
      this.mostrarModal(data);
    }
    
  }

  deleteList(position: number) {
    if (this.local) {
      let aux: any[] = [];

      for (let index = 0; index < this.hosts.length; index++) {
        const element = this.hosts[index];
        if (index != position) {
          aux.push(element);
        }
      }
      this.hosts = aux;
      this.onListChange.emit(this.hosts);
    }else{
      this.mostrarModalEliminar(position);
    }
  }

  listarHost() {
    this.isLoading = true;
    this.networkService.listarNetworks().subscribe(data=> {
      this.isLoading = false;
      if(data.success) {
        this.hosts = data.networks
      }else{
        this.messageService.error('Ha ocurrido un error inesperado');
      }
    });
    this.procesarError();
  }
  adicionar() {
    this.mostrarModal();
  }
  editar(data: any) {
    this.mostrarModal(data);
  }

  eliminar(id:number) {
    this.networkService.eliminarNetwork(id).subscribe(data=> {
      if(data.success) {
        this.listarHost();
      }
    })
  }

  mostrarModal(data?: any) {
    const modal = this.modal.create({
      nzContent: FormNetworkComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzKeyboard: false,
      nzMaskClosable: false,
      nzClosable: false,
      nzCentered: true,
      nzFooter: null,
      nzWidth: '100vh',
      nzComponentParams: {
        data: data,
        local: this.local,
      },
    });

    modal.afterClose.subscribe((data) => {
      if (data.data && this.local) {
        if (data.data.posicion == '' && data.data.posicion != '0') {
          console.log(data.data)
          this.addToList(data.data)
        } else {
          this.editList(data.data)
        }
        this.cdr.detectChanges()
      }else {
        if(data.data) {
          this.listarHost()
        }
      }
    });
  }

  existeIp(ip:string, position: number) {
    let listaAuxiliar = this.hosts;
    
    let  datos:any = null;
    if(position >= 0) {
      datos = this.hosts[position];
    }
    listaAuxiliar = listaAuxiliar.filter(
      (item: any) => item.host.toLowerCase().indexOf(ip.toLowerCase()) !== -1
    );
    if(datos) {
      if(listaAuxiliar.length > 0 && datos.host != ip) {
        return true;
      }
    } else {
      if(listaAuxiliar.length > 0) {
        return true;
      }
    }
  
    return false;
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
  procesarError() {
    this.errorService.getError().subscribe(e => {
       if(e) {
         this.isLoading = !e;
       }
     });
   }
}
