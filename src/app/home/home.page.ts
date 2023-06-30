import { Component, OnDestroy, OnInit } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { GeotService } from '../services/geot.service';
import { Router } from '@angular/router';
import { Listado } from '../interfaces/listados.interface';
import { GeolocationService } from '../services/geolocation.service';

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
    private geolocation$: GeolocationService
  ) {}

  ngOnInit(): void {
    localStorage.removeItem('listadoClientes');
  }

  messagetoast!: string;

  isToastOpen = false;

  listadoClientes!: Listado[];

  getlisatados(code: any) {
    this.geot$.getlistado(code).subscribe(
      (res) => {
        this.listadoClientes = res;
        const listadoString = JSON.stringify(this.listadoClientes);
        localStorage.setItem('listadoClientes', listadoString);
        this.router.navigate(['home/index']);
      },
      (err) => {
        console.log(err);
        this.messagetoast = err.message;
        this.setOpen(true);
        this.router.navigate(['home/index']);
      }
    );
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
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
}
