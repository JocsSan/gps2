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
    } else {
    }
    return statusRed;
  };

  finalPoint = async () => {
    const statusRed: {
      connected: boolean;
      connectionType: string;
    } = await this.netWorK$.getNetWorkStatus();
    console.log('network status', statusRed);
    console.log(statusRed.connected ? 'si hay señal' : 'no hay red pipipipipi');
    return statusRed;
  };

  purgeWorker = () => {
    console.log('a despachar todo lo que tengo en colas');
  };
}
