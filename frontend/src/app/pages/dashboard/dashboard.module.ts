import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionInicialModule } from '../configuracion-inicial/configuracion-inicial.module';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { DashboardService } from './dashboard.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import {ChartModule} from 'primeng/chart';
import { NzTableModule } from 'ng-zorro-antd/table';
const routes: Routes =  [{
  path: '',
  component: DashboardComponent
}];

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ConfiguracionInicialModule,
    NzModalModule,
    NzGridModule,
    NzCardModule,
    NzProgressModule,
    IconsProviderModule,
    ChartModule,
    NzTableModule
  ],
  providers: [AuthService, ErrorService, NzModalService, DashboardService]
})
export class DashboardModule { }
