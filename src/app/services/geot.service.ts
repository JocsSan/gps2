import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Listado } from '../interfaces/listados.interface';
import { Razon } from '../interfaces/razones.interface';

@Injectable({
  providedIn: 'root',
})
export class GeotService {
  private urlGeot = environment.geotUrl;

  constructor(private http: HttpClient) {}

  private sendRequest<T>(param: number, body: any): Observable<T[]> {
    const url = `${this.urlGeot}tracking-rl/${param}`;
    return this.http.post<T[]>(url, body).pipe(
      map((res) => {
        console.log(res);
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
    return this.sendRequest<Listado>(param, body);
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
    return this.sendRequest<Razon>(param, body);
  }
}
