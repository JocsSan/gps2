import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeotService } from '../services/geot.service';
import { Router } from '@angular/router';
import { Listado } from '../interfaces/listados.interface';
import { GeolocationService } from '../services/geolocation.service';
import { StorageService } from '../services/storage.service';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public subscripciones: { [key: string]: Subscription } = {};

  constructor(
    private geot$: GeotService,
    private router: Router,
    private geolocation$: GeolocationService,
    private storage$: StorageService
  ) {}

  networkStatus: any;
  networkListener!: PluginListenerHandle;

  async ngOnInit() {
    this.clearDB();
    localStorage.removeItem('listadoClientes');
    this.networkListener = Network.addListener(
      'networkStatusChange',
      (status) => {
        this.networkStatus = status;
        console.log('Network status changed', status);
      }
    );
  }

  messagetoast!: string;

  isToastOpen = false;

  listadoClientes!: Listado[];

  async getlisatados(code: any) {
    const previusListado = await this.storage$.get('listado');
    const previusCode = (await this.storage$.get('key')) || '';

    if (!!previusListado?.length && previusCode != '' && code == previusCode) {
      console.log('ya hay data');

      this.router.navigate(['home/index']);
      return;
    }
    this.storage$.remove('listado');
    this.storage$.remove('key');
    this.geot$.getlistado(code).subscribe(
      async (res) => {
        this.listadoClientes = res;
        const listadoString = JSON.stringify(this.listadoClientes);
        this.storage$.set('key', code);
        this.storage$.set('listado', res);
        localStorage.setItem('listadoClientes', listadoString);
        this.router.navigate(['home/index']);
      },
      (err) => {
        console.log(err);
        const customMsg = err?.error?.error || '';
        this.messagetoast = `${err.message}; ${customMsg}`;
        this.setOpen(true);
        setTimeout(() => {
          this.router.navigate(['home/index']);
        }, 2000);
      }
    );
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  async clearDB() {
    const storageKeys = await this.storage$.keys();
    const keysToRemove = storageKeys?.filter(
      (el) => el !== 'listado' && el !== 'key' && el !== 'post'
    );
    keysToRemove?.forEach((element) => {
      this.storage$.remove(element);
    });
  }

  ngOnDestroy() {
    console.log('funciona esto');

    Object.keys(this.subscripciones).forEach((key) => {
      try {
        this.subscripciones[key].unsubscribe();
      } catch (error) {
        console.log(error);
      }
    });
    this.geolocation$.detenerSeguimiento();
  }

  async getNetWorkStatus() {
    this.networkStatus = await Network.getStatus();
    //console.log(this.networkStatus);
  }

  endNetworkListener() {
    if (this.networkListener) {
      this.networkListener.remove();
    }
  }
}
