import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class JwtAutInterceptor implements HttpInterceptor {
  private cookie$ = inject(CookieService);
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.cookie$.get('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Access-Control-Allow-Origin', '*')
      .set('ngrok-skip-browser-warning', '69420');

    const clonedRequest = request.clone({ headers });

    return next.handle(clonedRequest);
  }
}
