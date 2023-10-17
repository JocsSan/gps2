import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Listado } from '../interfaces/listados.interface';
import { Razon } from '../interfaces/razones.interface';
import { OperacionInsertLocation } from '../interfaces/operation.interface';

@Injectable({
  providedIn: 'root',
})
export class GeotService {
  private urlGeot = environment.geotUrl;

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
      .get<Listado[]>(url, {
        params: {
          key: code,
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

  postOrderApi(order: Listado): Observable<any> {
    console.log('log de algo', order);
    //const observablexd = of(1);
    const url = `${this.urlGeot}ruta-logica/post-order`;
    const body = {
      order: order.Cliente,
      lat: order.Lat,
      lon: order.Lon,
      estadoEntrega: order.EstadoEntrega,
    };
    return this.http.post<any[]>(url, body).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  postPoint(unPunto: OperacionInsertLocation): Observable<any> {
    console.log('log de un punto', unPunto);

    const body = {
      p1: unPunto,
      p2: 0,
      p3: 0,
      p4: 0,
      p5: 0,
      p6: 0,
      p7: 0,
      p8: 0,
      p9: 0,
      p10: 0,
    };
    const param = 3;
    this.sendRequestPost({ param, body });
    //const observablexd = of(1);
    const response = this.sendRequestPost({ param, body });
    console.log(response);
    return of(1);
  }
}
