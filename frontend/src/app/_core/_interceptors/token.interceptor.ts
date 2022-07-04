import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,

} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../_auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var token='Bearer ';

    if(this.auth.isLogin())
     {
      token=token+this.auth.getSessionToken();  
    }
    const req=request.clone({
      headers:request.headers.set('Authorization',token)
    });
    return next.handle(req);
     }
    
  
}
