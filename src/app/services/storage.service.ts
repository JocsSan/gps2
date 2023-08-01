import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, Subject, Subscription, map } from 'rxjs';
import { Listado } from '../interfaces/listados.interface';
import { NetworkService } from './net-work.service';
import { Operacion } from '../interfaces/operation.interface';
import { GeotService } from './geot.service';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private orderObject = new Subject<Listado>();
  public subscripciones: { [key: string]: Subscription } = {};
  constructor(
    private storage: Storage,
    private network$: NetworkService,
    private geot$: GeotService
  ) {
    this.init();
  }

  /**
   * @description funcion que inicaliza la base de datos local
   */
  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    console.log('se uso la db');
    this._storage = storage;
  }

  /**
   * @description Funcion que se usa para guardar en la basde local
   * @param key
   * @param value
   */
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  /**
   * @description funcion que obtiene los datos guardados en local
   * @param key
   * @returns lo que esta en la base de datos en local de indexdb
   */
  public async get(key: string) {
    //const values = await this._storage?.get(key);
    //console.log('values', values);
    return await this._storage?.get(key);
  }

  /**
   * @description funcion que elimina un valor de la basde de datos en local, con el parametro de la clave
   * @param key
   */
  public remove(key: string) {
    this._storage?.remove(key);
  }

  /**
   * @description funcion que borra todo en la base de datos en local
   * @param key
   */
  public clear(key: string) {
    this._storage?.clear();
  }

  /**
   * @description funcion que retorna todas las claves que estan guardades en local en el indexdb
   * @returns
   */
  public keys() {
    const keys = this._storage?.keys();
    return keys;
  }

  /**
   * @description funcion que obtiene el numero de clave almancenados en local
   * @returns
   */
  public length() {
    const lonitud = this._storage?.length();
    return lonitud;
  }

  public setOrder(value: any) {
    this._storage?.set('take_order', value);
    this.orderObject.next(value);
  }

  /**
   * @description: para ver los cambios en vivo de las ordenes seleccionadas
   * @returns
   */
  getOrderObservable(): Observable<Listado> {
    return this.orderObject.asObservable();
  }

  async updateOrders(listadoNew: Listado) {
    const statusRed = await this.network$.getNetWorkStatus();
    const listadoOld = await this.get('listado');
    const listadosCurrent = listadoOld.map((el: Listado) => {
      if (el.Cliente === listadoNew.Cliente) {
        return {
          Chofer: listadoNew.Chofer,
          Cliente: listadoNew.Cliente,
          Contacto: listadoNew.Contacto,
          Direccion: listadoNew.Direccion,
          Enlistamiento: listadoNew.Enlistamiento,
          EstadoEntrega: listadoNew.EstadoEntrega,
          Factura: listadoNew.Factura,
          Fecha: listadoNew.Fecha,
          HoraAPI: listadoNew.HoraAPI,
          HoraEstimadaLlegada: listadoNew.HoraEstimadaLlegada,
          HoraEstimadaSalida: listadoNew.HoraEstimadaSalida,
          HoraLlegada: listadoNew.HoraLlegada,
          HorarioAtencion: listadoNew.HorarioAtencion,
          HoraSalida: listadoNew.HoraSalida,
          keyEntrega: listadoNew.keyEntrega,
          KmRecorridos: listadoNew.KmRecorridos,
          Lat: listadoNew.Lat,
          Lon: listadoNew.Lon,
          NomCliente: listadoNew.NomCliente,
          Orden: listadoNew.Orden,
          PrecioPorKm: listadoNew.PrecioPorKm,
          RutaOriginal: listadoNew.RutaOriginal,
          Telefono: listadoNew.Telefono,
          TiempoAdicional: listadoNew.TiempoAdicional,
          TiempoPromEntrega: listadoNew.TiempoPromEntrega,
        };
      }
      return el; // Return the original element if the condition is not met
    });
    if (statusRed.connected) {
      console.log('lo vamos a subir normal');
      this.postOrdersNetwork(listadoNew);
    } else {
      this.postOrdersLocal(listadoNew);
    }
    this.set('listado', listadosCurrent);
  }

  async postOrdersLocal(listado: Listado) {
    console.log(listado.NomCliente);
    const orders: Listado[] = await this.get('post_orders');
    if (orders?.length || 0 > 0) {
      orders.push(listado);
      this.set('post_orders', orders);
    } else {
      this.set('post_orders', [listado]);
    }
  }

  updateCliente(cliente: Listado) {
    this.set('cliente', cliente);
  }

  async postOrdersNetwork(listado: Listado) {
    //? la orden a mandar
    this.geot$.postOrderApi(listado).subscribe((res: any) => {
      console.log(res);
    });
    //?por si existen mas ordenes que mandar
    const orders: Listado[] = await this.get('post_orders');
    orders.forEach((element) => {
      this.geot$.postOrderApi(element).subscribe((res: any) => {
        console.log(res);
      });
    });
  }
}
