import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './_core/core.module';
import { NZ_I18N, es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IconsProviderModule } from './icons-provider.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ErrorInterceptor } from './_core/_interceptors/error.interceptor';
import { TokenInterceptor } from './_core/_interceptors/token.interceptor';
import { AuthService } from './_core/_auth/auth.service';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NgChartsModule } from 'ng2-charts';

const customConfig: NzConfig = {
  message: {
    nzTop:20, 
    nzDuration: 4000,
    nzAnimate: true
  },
  notification: { nzTop: 240 }
};
registerLocaleData(es);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,
    HttpClientModule,
    IconsProviderModule,
    NgChartsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: es_ES }, 
    NzMessageService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
       provide: NZ_CONFIG, 
       useValue: customConfig 
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
