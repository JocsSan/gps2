import { OperacionInsertLocation } from './../interfaces/operation.interface';
import { Injectable } from '@angular/core';
import { NetworkService } from './net-work.service';
import { StorageService } from './storage.service';
import { Listado } from '../interfaces/listados.interface';
import { GeotService } from './geot.service';
import { Observable, catchError, finalize, forkJoin, of, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostOfflinerService {
  constructor(
    private netWorK$: NetworkService,
    private storage$: StorageService,
    private geot$: GeotService
  ) {}

  /**
   * @description : Funcion que guarda los puntos por donde anda los motoristas
   * @param coordenadas
   * @returns
   */
  postPoint = async (coordenadas: { lat: number; lng: number }) => {
    //?determinamos si hay conexion a red
    const statusRed = await this.netWorK$.getNetWorkStatus();
    console.log('network status', statusRed);
    console.log(statusRed.connected ? 'si hay señal' : 'no hay red pipipipipi');

    //?Obtenemos
    const key: string = await this.storage$.get('key');
    const new_point: OperacionInsertLocation = {
      enlistamiento: key,
      lat: coordenadas.lat,
      lon: coordenadas.lng,
      operation: 'insert_location',
      timestamps: Date.now().toLocaleString(),
    };
    const points_post: OperacionInsertLocation[] = await this.storage$.get(
      'post_points'
    );
    if (points_post?.length > 0) {
      points_post.push(new_point);
      this.storage$.set('post_points', points_post);
    } else {
      this.storage$.set('post_points', [new_point]);
    }
    return statusRed;
  };

  /**
   * @description: funcion que sirve para guardar el ultimo punto para los pedidos
   * @param coordenadas
   * @returns
   */
  finalPoint = async (coordenadas: { lat: number; lng: number }) => {
    const statusRed = await this.netWorK$.getNetWorkStatus();
    console.log('network status', statusRed);

    console.log(statusRed.connected ? 'si hay señal' : 'no hay red pipipipipi');

    const final_points_post: OperacionInsertLocation[] =
      await this.storage$.get('post_final_points');
    if (final_points_post?.length > 0) {
    }
    return statusRed;
  };

  purgeWorker = () => {
    console.log('a despachar todo lo que tengo en colas');
  };

  /**
   * @description Funcion que sube los listaddos; esta funcion se usara solo al detectar si hay otra vez internet
   * @param listado
   */
  postListado = async () => {
    const ordersLocal: Listado[] = await this.storage$.get('post_orders');
    if (!ordersLocal?.length) {
      console.log('no hay ordenes en local');
      return;
    }
    this.storage$.remove('post_orders');
    const postOrderObservables: Observable<any>[] = ordersLocal.map(
      (element) => {
        return this.geot$.postOrder(element).pipe(
          catchError((err) => {
            console.log('Error en una solicitud:', err);
            return of({ error: err, element }); // Devuelve un observable con un objeto que contiene el error y el elemento que generó el error.
          })
        );
      }
    );

    const successfulResponses: any[] = [];
    const errorResponses: { error: any; element: Listado }[] = [];

    forkJoin(postOrderObservables)
      .pipe(
        finalize(async () => {
          console.log('Ya se terminaron todas las órdenes');
          console.log('Respuestas exitosas:', successfulResponses);
          console.log('Elementos con error:', errorResponses);
          this.storage$.remove('post_orders');
          this.storage$.set('error_responses', errorResponses);
          const errorResp = errorResponses.map((response) => {
            return response.element;
          });
          const new_resp: Listado[] = await this.storage$.get('post_orders');
          if ((new_resp?.length || 0) > 0) {
            new_resp.concat(errorResp);
          } else {
            this.storage$.set('post_orders', errorResp);
          }
        })
      )
      .subscribe(
        (responses) => {
          responses.forEach((res) => {
            if (res.hasOwnProperty('error')) {
              errorResponses.push({ error: res.error, element: res.element });
            } else {
              successfulResponses.push(res);
            }
          });
        },
        (err) => {
          console.log('Error en forkJoin:', err);
        }
      );
  };
}
