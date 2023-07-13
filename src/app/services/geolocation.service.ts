import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private positionSubject = new Subject<{ lat: number; lng: number }>();

  constructor(private storage$: StorageService) {}

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
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = undefined;
    }
  }

  getPositionObservable(): Observable<{ lat: number; lng: number }> {
    this.iniciarSeguimiento();

    return this.positionSubject.asObservable();
  }
}
