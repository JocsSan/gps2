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
    const new_point = await this.createNewPoint(coordenadas);
    await this.savePointToLocal(new_point);
    await this.sendPointsToAPI();
  };

  /**
   * @description : Funcion que guarda los puntos por donde anda los motoristas
   * @param coordenadas
   * @returns
   */
  createNewPoint = async (coordenadas: { lat: number; lng: number }) => {
    const key: string = await this.storage$.get('key');
    const cliente: Listado = await this.storage$.get('take_order');
    const new_point: OperacionInsertLocation = {
      enlistamiento: key,
      lat: coordenadas.lat,
      lon: coordenadas.lng,
      operation: 'insert_location',
      cliente: cliente?.Cliente || '',
      timestamps: new Date(Date.now()).toLocaleString('es-ES', {
        timeZone: 'UTC',
      }),
      ultimoPunto: false,
    };
    return new_point;
  };

  /**
   * @description : Funcion que guarda los en local los puntos por donde anda los motoristas
   * @param new_point
   * @returns
   */
  savePointToLocal = async (new_point: OperacionInsertLocation) => {
    let points_post: OperacionInsertLocation[] = await this.storage$.get(
      'post_points'
    );
    if (!points_post) {
      points_post = [];
    }
    points_post.push(new_point);
    await this.storage$.set('post_points', points_post);
  };

  //en esta funncio quiero que se guarden los puntos en local e caso de que no haya internet o una respuesta correcta crees poder ayudarme con eso
  /**
   * @description : Funcion que envia la lista de puntos al servidor
   * @returns
   */
  sendPointsToAPI = async () => {
    const statusRed = await this.netWorK$.getNetWorkStatus();
    let points: OperacionInsertLocation[] = await this.storage$.get(
      'post_points'
    );

    if (statusRed.connected && points && points.length > 0) {
      try {
        const res: number = await this.geot$.postPoint(points).toPromise();
        console.log(res);

        await this.storage$.remove('post_points');
        this.logPointsx(points);
      } catch (error) {
        console.log(
          'Error al enviar el punto a la API, se guardó en local',
          error
        );
      }
    } else if (!statusRed.connected && points && points.length > 0) {
      console.log(
        'No hay conexión a Internet, los puntos se guardaron en local'
      );
    }
  };

  async logPointsx(points: OperacionInsertLocation[]) {
    console.log('entra a los log');
    const points_local: OperacionInsertLocation[] = await this.storage$.get(
      'log_post_points'
    );
    console.log('local logs', points_local?.length || 0);
    if (points_local?.length || 0 > 0) {
      console.log('a agregar mas puntos');
      const new_points = points_local.concat(points);
      await this.storage$.set('log_post_points', new_points);
    } else {
      console.log('inicalizar el log');
      await this.storage$.set('log_post_points', points);
    }
  }

  //TODO: Revisar funcion
  /**
   * @description: funcion que sirve para guardar el ultimo punto para los pedidos
   * @param coordenadas
   */
  finalPoint = async (coordenadas: { lat: number; lng: number }) => {
    const final_point = await this.createFinalPoint(coordenadas);
    await this.saveFinalPointToLocal(final_point);
    await this.sendFinalPointsToAPI();
  };

  createFinalPoint = async (coordenadas: { lat: number; lng: number }) => {
    const key: string = await this.storage$.get('key');
    const cliente: Listado = await this.storage$.get('take_order');
    const final_point: OperacionInsertLocation = {
      enlistamiento: key,
      lat: coordenadas.lat,
      lon: coordenadas.lng,
      operation: 'insert_location',
      cliente: cliente?.Cliente || '',
      timestamps: new Date(Date.now()).toLocaleString('es-ES', {
        timeZone: 'UTC',
      }),
      ultimoPunto: true,
    };
    return final_point;
  };

  saveFinalPointToLocal = async (final_point: OperacionInsertLocation) => {
    let final_points_post: OperacionInsertLocation[] = await this.storage$.get(
      'post_final_points'
    );
    if (!final_points_post) {
      final_points_post = [];
    }
    final_points_post.push(final_point);
    await this.storage$.set('post_final_points', final_points_post);
  };

  sendFinalPointsToAPI = async () => {
    const statusRed = await this.netWorK$.getNetWorkStatus();
    let points: OperacionInsertLocation[] = await this.storage$.get(
      'post_final_points'
    );

    if (statusRed.connected && points && points.length > 0) {
      try {
        const res: number = await this.geot$.postPoint(points).toPromise();
        console.log(res);

        await this.storage$.remove('post_final_points');
        this.logPointsx(points);
      } catch (error) {
        console.log(
          'Error al enviar el punto a la API, se guardó en local',
          error
        );
      }
    } else if (!statusRed.connected && points && points.length > 0) {
      console.log(
        'No hay conexión a Internet, los puntos se guardaron en local'
      );
    }
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
        //TODO: mandar la orden
        return this.geot$.postOrderApi(element).pipe(
          map((res) => {
            this.storage$.remove('listado');
            this.storage$.set('listado', res);
            return res;
          }),
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
