import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
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
    const values = await this._storage?.get(key);
    console.log('values', values);
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
}
