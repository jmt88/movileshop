import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspeccionComponent } from './inspeccion/inspeccion.component';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InspeccionService } from './inspeccion.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NavegacionDiaComponent } from './navegacion-dia/navegacion-dia.component';
import { NavegacionUsuarioComponent } from './navegacion-usuario/navegacion-usuario.component';
import { NavegacionIpComponent } from './navegacion-ip/navegacion-ip.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
const routes: Routes = [{
  path: '',
  component:InspeccionComponent,
}]


@NgModule({
  declarations: [
    InspeccionComponent,
    GeneralComponent,
    NavegacionDiaComponent,
    NavegacionUsuarioComponent,
    NavegacionIpComponent,
  ],
  exports:[
    GeneralComponent, 
    NavegacionDiaComponent,
    NavegacionUsuarioComponent,
    NavegacionIpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzTabsModule,
    NzTableModule,
    NzSelectModule,
    IconsProviderModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    NzCardModule,
    NzDatePickerModule,
    FormsModule
  ],
  providers: [ErrorService, NzMessageService, InspeccionService]
})
export class InspeccionModule { }
