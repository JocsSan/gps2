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
    await this.getRazones();
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

  /**
   * @description : obtiene las razones para estados de los pedidos y entregas
   */
  async getRazones() {
    console.log('se esta obteniendo razones');

    this.geot$.getRazones().subscribe(
      (res) => {
        const razones = res;
        console.log(razones);
        this.storage$.set('razones', razones);
      },
      (err) => {
        console.log(err);
        const razones = this.razonesTest;
        this.storage$.set('razones', razones);
        const customMsg = err?.error?.error || '';
        this.messagetoast = `${err.message}; ${customMsg}`;
        this.setOpen(true);
      }
    );
  }

  /**
   * @description obtiene los clientes de la ruta
   * @param code codigo con el que se obiene el listado
   * @returns
   */
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
    this.geot$.getListado(code).subscribe(
      async (res) => {
        if (res.length > 0) {
          this.listadoClientes = res;
          const listadoString = JSON.stringify(this.listadoClientes);
          this.storage$.set('key', code);
          this.storage$.set('listado', res);
          localStorage.setItem('listadoClientes', listadoString);
          this.router.navigate(['home/index']);
        }

        //!para test
        this.messagetoast = 'No hay existen recorridos para esta ruta';
        this.setOpen(true);
        setTimeout(() => {
          this.router.navigate(['home/index']);
        }, 2000);
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

  /**
   * @description funcion para abrir el toast
   * @param isOpen
   */
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  /**
   * @description : funcion que limpia la base de datos
   * local menos el listado y la key para evitar estar
   * haciendo consultas inncesarias, no se si en eun
   * futuro en tendre que limpiar mejor de otra manera
   */
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

  /**
   * @description metodo que obtiene el estado actual de la red
   */
  async getNetWorkStatus() {
    this.networkStatus = await Network.getStatus();
    //console.log(this.networkStatus);
  }

  /**
   * @description funcion para darle cuello al metodo de obtener red
   */
  endNetworkListener() {
    if (this.networkListener) {
      this.networkListener.remove();
    }
  }

  //variable de prueba
  razonesTest = [
    {
      EstadoEntrega: 1,
      Descripcion: 'PENDIENTE',
    },
    {
      EstadoEntrega: 2,
      Descripcion: 'EN TRANSITO',
    },
    {
      EstadoEntrega: 3,
      Descripcion: 'ENTREGADO',
    },
    {
      EstadoEntrega: 4,
      Descripcion: 'ANULADO',
    },
  ];
}
