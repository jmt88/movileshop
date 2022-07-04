import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermisosComponent } from './permisos/permisos.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworksComponent } from './networks/networks.component';
import { FormNetworkComponent } from './networks/form-network/form-network.component';
import { ImportacionUsuariosComponent } from './importacion-usuarios/importacion-usuarios.component';
import { NetworkService } from '../network/network.service';

@NgModule({
  declarations: [
    PermisosComponent,
    NetworksComponent,
    FormNetworkComponent,
    ImportacionUsuariosComponent
  ],
  exports: [PermisosComponent, NetworksComponent, ImportacionUsuariosComponent],
  entryComponents: [PermisosComponent, NetworksComponent, ImportacionUsuariosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzStepsModule,
    NzRadioModule,
    NzSelectModule,
    NzGridModule,
    NzButtonModule,
    NzDividerModule,
    NzCardModule,
    IconsProviderModule,
    NzSpinModule,
    NzTableModule,
    NzSwitchModule,
    NzCheckboxModule
  ],
  providers:[NetworkService]
})
export class ComponentsModule { }
