import { Component, OnDestroy, OnInit } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { GeotService } from '../services/geot.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public subscripciones: { [key: string]: Subscription } = {};
  myImage: any;
  position?: any;
  logGuardado: any;
  seGuardo: boolean = false;

  cambioDistancias!: number;

  networkStatus: any;
  networkListener!: PluginListenerHandle;

  constructor(private geot$: GeotService, private router: Router) {}

  coordenadasActual!: { long: number; lat: number };

  ngOnInit(): void {}

  messagetoast!: string;

  isToastOpen = false;

  code!: string;

  getlisatados(code: any) {
    this.geot$.getlistado(code).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['home/index']);
      },
      (err) => {
        console.log(err);
        this.messagetoast = err.message;
        this.router.navigate(['home/index']);
        this.setOpen(true);
      }
    );
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  ngOnDestroy() {
    Object.keys(this.subscripciones).forEach((key) => {
      try {
        this.subscripciones[key].unsubscribe();
      } catch (error) {
        console.log(error);
      }
    });
  }
}
