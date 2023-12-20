import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Listado } from '../interfaces/listados.interface';
import { Razon } from '../interfaces/razones.interface';
import { OperacionInsertLocation } from '../interfaces/operation.interface';
import { ResponseListado } from '../interfaces/response.interface';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class GeotService {
  readonly urlGeot = environment.geotUrl;
  private cokie$ = inject(CookieService);
  constructor(private http: HttpClient) {}

  private sendRequestPost<T>(request: {
    param: number;
    body: any;
  }): Observable<T[]> {
    console.log(
      'mandando una request',
      request.param,
      new Date(Date.now()).toLocaleString('es-ES', { timeZone: 'UTC' })
    );

    const url = `${this.urlGeot}tracking-rl/${request.param}`;
    return this.http.post<T[]>(url, request.body).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  getListado(code: string): Observable<Listado[]> {
    const timestamp = new Date().getTime();
    const url = `${this.urlGeot}ruta-logica/get-enlistamiento`;
    return this.http
      .get<ResponseListado>(url, {
        headers: { 'ngrok-skip-browser-warning': '69420' },
        params: {
          key: code,
          timestamp: timestamp.toString(),
        },
      })
      .pipe(
        map((res) => {
          console.log('respuesta de la api', res);
          this.cokie$.set('token', res.token);
          return res.listado;
        }),
        catchError((err) => {
          throw err;
        })
      );
  }

  getRazones(): Observable<Razon[]> {
    const timestamp = new Date().getTime();
    const url = `${this.urlGeot}ruta-logica/get-razones`;
    return this.http
      .get<Razon[]>(url, {
        headers: { 'ngrok-skip-browser-warning': '69420' },
        params: {
          timestamp: timestamp.toString(),
        },
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((err) => {
          throw err;
        })
      );
  }

  postOrderApi(order: Listado): Observable<any> {
    console.log('log de algo', order);

    const url = `${this.urlGeot}ruta-logica/post-order`;
    const body = {
      order: order.Cliente,
      lat: order.Lat,
      lon: order.Lon,
      estadoEntrega: order.EstadoEntrega,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
        'ngrok-skip-browser-warning': '69420',
      }),
    };

    return this.http.post<any[]>(url, body, httpOptions).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  postPoint(unPunto: OperacionInsertLocation[]): Observable<any> {
    const url = `${this.urlGeot}ruta-logica/post-point`;
    return this.http.post<any[]>(url, unPunto).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }
}
