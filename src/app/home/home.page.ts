import { Component, OnDestroy, OnInit } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { GeotService } from '../services/geot.service';
import { Router } from '@angular/router';
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public subscripciones: { [key: string]: Subscription } = {};

  constructor(private geot$: GeotService, private router: Router) {}

  ngOnInit(): void {
    this.iniciarSeguimiento();
  }

  watchId: any;

  coordenadas!: { lat: number; lng: number };

  iniciarSeguimiento() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 3000,
    };

    this.watchId = Geolocation.watchPosition(options, (position: any) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      this.coordenadas = { lat: latitude, lng: longitude };
      console.log('Ubicación actualizada:', latitude, longitude);
    });
  }

  detenerSeguimiento() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = undefined;
    }
  }

  messagetoast!: string;

  isToastOpen = false;

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
