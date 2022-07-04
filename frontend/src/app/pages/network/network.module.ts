import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkComponent } from './network/network.component';
import { ComponentsModule } from '../components/components.module';
import { NetworkService } from './network.service';
import { Routes, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';


const routes: Routes = [
  {
    path:"",
    component:NetworkComponent
  }
]
@NgModule({
  declarations: [
    NetworkComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  providers:[NetworkService, NzModalService]
})
export class NetworkModule { }
