import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class JwtGuard implements CanActivate {
  private cokie$ = inject(CookieService);
  private jwtHelper = new JwtHelperService();
  private router = inject(Router);
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.cokie$.get('token');
    const isExpired = this.jwtHelper.isTokenExpired(token);
    const decodedToken = this.jwtHelper.decodeToken(token);
    console.log(decodedToken);
    //const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
    if (isExpired) {
      this.cokie$.delete('token');
      this.router.navigate(['/']);
      return false;
    }
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
