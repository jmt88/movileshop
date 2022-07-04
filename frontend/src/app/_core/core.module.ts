import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './_layout/layout.module';
import { AuthModule } from './_auth/auth.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LayoutModule,
    AuthModule
  ]
})
export class CoreModule { }
