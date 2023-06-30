import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private positionSubject = new Subject<{ lat: number; lng: number }>();

  constructor() {}

  watchId!: any;

  iniciarSeguimiento() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 3000,
    };

    this.watchId = Geolocation.watchPosition(options, (position: any) => {
      const latitude = position?.coords?.latitude;
      const longitude = position?.coords?.longitude;
      const currentPoint = { lat: latitude, lng: longitude };
      this.positionSubject.next(currentPoint);
    });
  }

  //?matar la obtencion de coordenadas
  detenerSeguimiento() {
    console.log('ME DETUVE');

    if (this.watchId) {
      console.log('si funciona');
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = undefined;
    }
  }

  getPositionObservable(): Observable<{ lat: number; lng: number }> {
    this.iniciarSeguimiento();
    console.log('se actualiza');

    return this.positionSubject.asObservable();
  }
}
