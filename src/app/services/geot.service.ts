import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Listado } from '../interfaces/listados.interface';
import { Razon } from '../interfaces/razones.interface';
import { OperacionInsertLocation } from '../interfaces/operation.interface';
import { ResponseListado } from '../interfaces/response.interface';
import { CookieService } from 'ngx-cookie-service';
import { StorageService } from './storage.service';

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

  /**
   * @description : obtiene el listado de clientes para el usuario logueado
   * @param code : key de enlistamiento
   * @returns : listado de clientes
   * */
  getListado(code: string): Observable<Listado[]> {
    const timestamp = new Date().getTime();
    const url = `${this.urlGeot}ruta-logica/get-enlistamiento`;
    return this.http
      .get<ResponseListado>(url, {
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
          console.log('error de la api', err);

          throw err;
        })
      );
  }

  /**
   * @description : obtiene las razones para estados de los pedidos y entregas
   * @returns : listado de razones
   */
  getRazones(): Observable<Razon[]> {
    const timestamp = new Date().getTime();
    const url = `${this.urlGeot}ruta-logica/get-razones`;
    return this.http
      .get<Razon[]>(url, {
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

  /**
   * @description : guarda los pedidos y entregas
   * @param order : objeto con la informacion del listado
   * @returns : listado de razones
   */
  postOrderApi(order: Listado): Observable<Listado[]> {
    console.log('log de algo', order);
    const url = `${this.urlGeot}ruta-logica/post-order`;
    const body = {
      order: order.Cliente,
      lat: order.Lat,
      enlistamiento: order.Enlistamiento,
      lon: order.Lon,
      estadoEntrega: order.EstadoEntrega,
    };

    return this.http.post<Listado[]>(url, body).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  /**
   * @description : guarda los puntos de la ruta
   * @param unPunto : objeto con la informacion del punto
   * @returns : status del post
   */
  postPoint(unPunto: OperacionInsertLocation[]): Observable<any> {
    unPunto = unPunto.filter(
      (v, i, a) =>
        a.map((e) => JSON.stringify(e)).indexOf(JSON.stringify(v)) === i
    );

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

  /**
   * @description : code o key de enlistamiento
   * @param code : objeto con la informacion del punto
   * @returns : status del post
   */
  refreshtoken = (code: string): Observable<boolean> => {
    const url = `${this.urlGeot}ruta-logica/refresh-token`;
    const timestamp = new Date().getTime();
    const token = this.cokie$.get('token');
    const body = {
      key: code,
      token,
      timestamp: timestamp.toString(),
    };
    return this.http.patch<{ token: string }>(url, body).pipe(
      map((res) => {
        this.cokie$.delete('token');
        this.cokie$.set('token', res.token);
        return true;
      }),
      catchError((err) => {
        throw err;
      })
    );
  };
}
