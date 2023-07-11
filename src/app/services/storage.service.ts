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

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    console.log('se uso la db');
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  public async get(key: string) {
    const values = await this._storage?.get(key);
    console.log('values', values);
    return await this._storage?.get(key);
  }

  public remove(key: string) {
    this._storage?.remove(key);
  }

  public clear(key: string) {
    this._storage?.clear();
  }

  public keys() {
    const keys = this._storage?.keys();
    return keys;
  }

  public length() {
    const lonitud = this._storage?.length();
    return lonitud;
  }
}
