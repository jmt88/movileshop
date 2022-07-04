import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionInicialComponent } from './configuracion-inicial/configuracion-inicial.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { ConfiguracionService } from './configuracion.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    ConfiguracionInicialComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
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
  ],
  exports: [ConfiguracionInicialComponent],
  entryComponents: [ConfiguracionInicialComponent],
  providers: [ConfiguracionService, ErrorService, NzModalService]
})
export class ConfiguracionInicialModule { }
