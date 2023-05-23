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

  ngOnInit(): void {
    this.subscripciones['interval'] = interval(5000).subscribe(() => {
      // Realizar el cálculo cada 5 segundos
      this.getCurrentPosition();
      this.listenerInternet();
    });
    this.networkListener = Network.addListener(
      'networkStatusChange',
      (status) => {
        this.networkStatus = status;
        console.log('Network status changed', status);
      }
    );
  }

  async getNetWorkStatus() {
    this.networkStatus = await Network.getStatus();
    console.log(this.networkStatus);
  }

  endNetworkListener() {
    if (this.networkListener) {
      this.networkListener.remove();
    }
  }

  ngOnDestroy() {
    if (this.networkListener) {
      this.networkListener.remove();
    }
    Object.keys(this.subscripciones).forEach((key) => {
      try {
        this.subscripciones[key].unsubscribe();
      } catch (error) {
        console.log(error);
      }
    });
  }

  listenerInternet() {
    console.log('internet');

    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
    });
    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();

      console.log('Network status:', status);
    };
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    this.myImage = image.webPath;
  }

  async getCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();

      this.position = coordinates;

      //    console.log(this.position);

      //const latitudPuntoA = 15.46791001156522; // Latitud del punto A en grados
      //const longitudPuntoA = -87.96034665999613; // Longitud del punto A en grados
      const latitudPuntoB = 15.46654599918261; // Latitud del punto B en grados
      const longitudPuntoB = -87.96122335408147; // Longitud del punto B en grados
      const distancia = this.calcularDistancia(
        this.position.coords.latitude,
        this.position.coords.longitude,
        latitudPuntoB,
        longitudPuntoB
      );
      this.cambioDistancias = distancia;
      console.log('Diferencia en metros:', distancia.toFixed(2), 'metros');
    } catch (error) {
      console.log('sin conexcion');
    }
  }

  async share() {
    await Share.share({
      title: 'Come and find me',
      text: `Here's my current location:
        ${this.position.coords.latitude},
        ${this.position.coords.longitude}`,
      url: 'http://ionicacademy.com/',
    });
  }
  //? calculo de distancias
  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
    const radioTierra = 6371000;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = radioTierra * c;

    if (distancia > 180) {
      this.seGuardo = true;

      this.logGuardado = Date.now();

      console.log('se ha guardado');
    }

    return distancia;
  }

  toRad(grados: any) {
    return (grados * Math.PI) / 180;
  }
}
