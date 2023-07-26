import { OperacionInsertLocation } from './../interfaces/operation.interface';
import { Injectable } from '@angular/core';
import { NetworkService } from './net-work.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class PostOfflinerService {
  constructor(
    private netWorK$: NetworkService,
    private storage$: StorageService
  ) {}

  postPoint = async (coordenadas: { lat: number; lng: number }) => {
    //?determinamos si hay conexion a red
    const statusRed: {
      connected: boolean;
      connectionType: string;
    } = await this.netWorK$.getNetWorkStatus();
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

  finalPoint = async (coordenadas: { lat: number; lng: number }) => {
    const statusRed: {
      connected: boolean;
      connectionType: string;
    } = await this.netWorK$.getNetWorkStatus();
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
}
