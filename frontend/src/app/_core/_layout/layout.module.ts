import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './_header/header.component';
import { FooterComponent } from './_footer/footer.component';
import { AsideComponent } from './_aside/aside.component';
import { SubHeaderComponent } from './_sub-header/sub-header.component';
import { LayoutComponent } from './_layout/layout.component';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { IconsProviderModule } from '../../icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { PagesRoutingModule } from './pages-routing.module';
import { AuthService } from '../_auth/auth.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import {SidebarModule} from 'primeng/sidebar';
import { NzModalService } from 'ng-zorro-antd/modal';
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AsideComponent,
    SubHeaderComponent,
    LayoutComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AsideComponent,
    SubHeaderComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    IconsProviderModule,
    NzButtonModule,
    NzDividerModule,
    NzGridModule,
    NzDropDownModule,
    PagesRoutingModule,
    NzAvatarModule,
    NzBadgeModule,
    SidebarModule
  ],
  providers: [AuthService, NzModalService]
})
export class LayoutModule { }
