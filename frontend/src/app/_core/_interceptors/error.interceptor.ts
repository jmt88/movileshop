
import { AuthService } from '../_auth/auth.service';
import { Router } from '@angular/router';

import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {mergeMap, delay, retryWhen} from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ErrorService } from './error.service';

export const maxRetries = 1;
export const delayMs = 2000;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService, private messageService: NzMessageService, private router: Router, private errorService: ErrorService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
          retryWhen((error) => {
            return error.pipe(
              mergeMap((err, index) => {
                if (index < maxRetries && err.status == 500) {
                  
                  return of(err).pipe(delay(delayMs));
                 
                }
                
                if (index < maxRetries && (err.status == 401 || err.status == 403)) {
                   this.auth.LogoutGuard();
                }else {
                  this.messageService.error('Ha ocurrido un error inesperado. Por favor contacte a su proveedor de servicios');
                  this.errorService.setError(true);
                }

                setTimeout(()=>{
                  this.errorService.setError(false);
                },400)
                
                throw err;
              })
            )
            })
        )
      }
}
