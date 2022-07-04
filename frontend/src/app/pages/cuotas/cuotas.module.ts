import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuotasComponent } from './cuotas/cuotas.component';
import { ComponentsModule } from '../components/components.module';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { CuotasService } from './cuotas.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Routes, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { IconsProviderModule } from 'src/app/icons-provider.module';

const routes: Routes = [
  {
    path:"",
    component: CuotasComponent
  }
]

@NgModule({
  declarations: [
    CuotasComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NzCardModule,
    NzButtonModule,
    NzSpinModule,
    IconsProviderModule,
    RouterModule.forChild(routes)
  ],
  providers:[AuthService, CuotasService, NzMessageService]
})
export class CuotasModule { }
