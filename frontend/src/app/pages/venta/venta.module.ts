import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaComponent } from './venta/venta.component';
import { RouterModule, Routes } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ComponentsModule } from '../components/components.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { VentaService } from './venta.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
const routes: Routes = [{
  path: '',
  component: VentaComponent
}]

@NgModule({
  declarations: [
    VentaComponent
  ],
  entryComponents:[],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzInputNumberModule,
    NzGridModule,
    NzCardModule,
    ComponentsModule,
    NzInputModule,
    NzSelectModule,
    NzGridModule,
    NzSwitchModule,
    NzButtonModule,
    IconsProviderModule,
    NzModalModule,
    NzTableModule,
    NzStepsModule,
    NzSpinModule,
    NzCheckboxModule,
    NzFormModule,
    NzDividerModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[VentaService, ErrorService, AuthService,NzModalService]
})
export class VentaModule { }
