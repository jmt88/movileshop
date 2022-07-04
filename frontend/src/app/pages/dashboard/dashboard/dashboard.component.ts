import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import {  NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { ConfiguracionInicialComponent } from '../../configuracion-inicial/configuracion-inicial/configuracion-inicial.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  data: any = '';

  datosNavegacion!: any;
  dia!: any
  porcientoDia!:any
  
  semana!: any
  porcientoSemana!:any
  
  mes!: any
  porcientoMes!:any
  
  dataChart: any;
  cuota!: any;

  chartOptions: any;
  listadoSitios: any[] = [];
  constructor(private authService: AuthService, private errorService: ErrorService, 
    private cdr: ChangeDetectorRef, private modal: NzModalService, 
    private viewContainerRef: ViewContainerRef, private dashboardService: DashboardService) {
     this.data = this.authService.getSession();
   }

  ngOnInit(): void {
    
  }
}
