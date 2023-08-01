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

  private sendRequest<T>(request: {
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
    const body = {
      p1: code,
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

    const param = 1;
    return this.sendRequest<Listado>({ param, body });
  }

  getRazones(): Observable<Razon[]> {
    const body = {
      p1: 0,
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

    const param = 2;
    return this.sendRequest<Razon>({ param, body });
  }

  postOrderApi(algo: Listado): Observable<any> {
    console.log('log de algo', algo);
    const observablexd = of(1);
    const param = 4;
    const body = {
      p1: algo,
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
    return this.sendRequest({ param, body }) || 1;
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
    this.sendRequest({ param, body });
    const observablexd = of(1);
    return this.sendRequest({ param, body }) || 1;
  }
}
