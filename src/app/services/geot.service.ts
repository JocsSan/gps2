import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map } from 'rxjs';
import { Listado } from '../interfaces/listados.interface';

@Injectable({
  providedIn: 'root',
})
export class GeotService {
  constructor(private http: HttpClient) {}

  private urlGeot = environment.geotUrl;

  getlistado(code: string): Observable<Listado[]> {
    //? la opccion del listado es la opcion 14
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

    const param = 14;
    const url = `${this.urlGeot}consultasEnlistamientos/${param}`;

    return this.http.post<Listado[]>(url, body).pipe(
      map((res) => {
        console.log(res);
        return res;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }
}
