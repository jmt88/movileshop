import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        if (this.auth.isLogin()) {
            if (next.url[0]) {
                const ruta = next.url[0].path;
                if (ruta === '/changepassword') {
                    return true;
                }
                else
                {
                    
                    return this.auth.canexecute("/"+ruta).ver;
                }
            }
            else {
                return true;
            }
        }
        this.router.navigate(['/auth/login']);
        return false;
    }

}
