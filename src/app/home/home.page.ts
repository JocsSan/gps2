import { Component, OnDestroy, OnInit } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';
import { Subscription, interval } from 'rxjs';
import { Network } from '@capacitor/network';

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

  constructor() {}

  coordenadasActual!: { long: number; lat: number };

  ngOnInit(): void {}

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
