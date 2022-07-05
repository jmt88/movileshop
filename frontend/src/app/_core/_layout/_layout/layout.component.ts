import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ConfiguracionInicialComponent } from 'src/app/pages/configuracion-inicial/configuracion-inicial/configuracion-inicial.component';
import { AuthService } from '../../_auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  
  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private modal: NzModalService, private viewContainerRef: ViewContainerRef) { }
  visible = false;
  
  permisos: any[] = [];
  nivel1: any[] = [];
  nivel2: any[] = [];
  nivel3: any[] = [];
  nivel4: any[] = [];

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.permisos = this.authService.getSessionPermisos();
    this.asignarPermisos(this.permisos);
    this.cdr.detectChanges();
  }
  onChangeVisible(e:boolean){
    this.visible = e;
  }

  asignarPermisos(datos: any[]) {
    datos.forEach(element => {
      if(element.grupo == 1 && element.ver) {
        this.nivel1.push(element);
      }
      if(element.grupo == 2 && element.ver) {
        this.nivel2.push(element);
      }
      if(element.grupo == 3 && element.ver) {
        this.nivel3.push(element);
      }
      if(element.grupo == 4 && element.ver) {
        this.nivel4.push(element);
      }
    });
  }

  configurar() {
    this.modal.create({
      nzContent: ConfiguracionInicialComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzKeyboard: false,
      nzMaskClosable: false,
      nzClosable: false,
      nzCentered: true,
      nzFooter: null,
      nzWidth: "100%"
    })
  }
}
