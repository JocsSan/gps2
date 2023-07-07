import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { AlertInput } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscripciones: { [key: string]: Subscription } = {};
  myImage: any;
  position?: any;
  logGuardado: any;
  seGuardo: boolean = false;

  networkStatus: any;
  networkListener!: PluginListenerHandle;
  receivedData!: any;

  //*variables de mapa-------------------------------
  cambioDistancias!: number;

  //?variables de puntos de mapa

  markerDestiny!: { lat: number; lng: number };

  currentPoint!: { lat: number; lng: number };

  center!: { lat: number; lng: number };

  previousPoint!: { lat: number; lng: number };

  //?--------------------------

  //*------------------------------------------------

  constructor(
    private router: Router,
    private geolocation$: GeolocationService
  ) {}

  valueInput: string = 'alguna mierda';

  //?---botones del alert
  public alertButtons = ['OK'];
  public alertInputs = [
    {
      placeholder: 'Nickname (max 8 characters)',
      attributes: {
        maxlength: 8,
      },
      handler: (data: { username: string }) => {
        // Tu lógica de validación aquí
      },
      value: this.valueInput,
      // Escucha el evento ionInput y llama a handleInputChange
      '(ionInput)': 'handleInputChange($event)',
    },
  ];

  handleInputChange(event: CustomEvent) {
    const inputValue = event.detail.value;
    // Hacer algo con el valor del campo de entrada
    console.log('Valor actual del campo de entrada:', inputValue);
  }

  //?-----------------------

  ngAfterViewInit(): void {
    this.networkListener = Network.addListener(
      'networkStatusChange',
      (status) => {
        this.networkStatus = status;
        if (status.connected) {
          // Se ha restablecido la conexión a Internet
        }
        //console.log('Network status changed', status);
      }
    );

    this.getNetWorkStatus();

    this.subscripciones['interval'] = interval(5000).subscribe(() => {
      if (this.networkStatus?.connected) {
        // Hay conexión a Internet
      }
    });
  }

  ngOnInit(): void {
    this.receivedData = null;
    const localCliente = localStorage.getItem('cliente');

    if (localCliente) {
      this.receivedData = JSON.parse(localCliente);
      console.log(this.receivedData);
      this.markerDestiny = {
        lat: this.receivedData.Lat,
        lng: this.receivedData.Lon,
      };
    }
    this.getseguimiento();
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

  ngOnDestroy() {
    this.receivedData = null;
    localStorage.removeItem('cliente');
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

    this.detenerSeguimiento();
  }

  listenerInternet() {
    Network.addListener('networkStatusChange', (status) => {
      //console.log('Network status changed', status);
    });
    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();

      //console.log('Network status para ver si simplifico:', status);
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

  watchId: any;

  //*--------------------------------------------------------------------

  //?obtencion de coordenadas

  nuevaPosition: any;

  getseguimiento() {
    this.subscripciones['geolocation'] = this.geolocation$
      .getPositionObservable()
      .subscribe(
        (positionObs: { lat: number; lng: number }) => {
          this.nuevaPosition = positionObs;
          // Aquí puedes utilizar la posición actualizada
          console.log(positionObs);
          const { lat } = positionObs;
          const { lng } = positionObs;
          this.currentPoint = { lat: lat, lng: lng };
          this.center = { lat: lat, lng: lng };
          this.cambioDistancias = this.calcularDistancia(
            this.currentPoint?.lat,
            this.currentPoint?.lng,
            this.markerDestiny?.lat,
            this.markerDestiny?.lng
          );

          if (this.currentPoint?.lat) {
            this.guardar();
          }
          console.log(
            'cambios de la distancia con nuevo seguimiento',
            this.cambioDistancias
          );
        },
        (error) => {
          // Manejo de errores
          console.error(error);
        }
      );
  }

  private fisrtValue: boolean = true;

  timestampText: any;

  mssg!: string;

  finalizo: boolean = false;

  guardar() {
    // Verificar si currentPoint y markerDestiny no son nulos o indefinidos

    if (this.fisrtValue) {
      const distanciaDestino = this.calcularDistancia(
        this.currentPoint.lat,
        this.currentPoint.lng,
        this.markerDestiny.lat,
        this.markerDestiny.lng
      );

      if (distanciaDestino < 200) {
        console.log('Finalizó el destino en primer tiro');
        this.mssg = 'Finalizó el destino en primer tiro';
        this.finalizo = true;
        this.timestampText = Date.now();
        return;
      }

      console.log('Primer tiro');
      this.mssg = 'Primer Tiro';
      this.timestampText = Date.now();
    }

    this.fisrtValue = false;

    if (this.currentPoint && this.markerDestiny) {
      const distanciaDestino = this.calcularDistancia(
        this.currentPoint.lat,
        this.currentPoint.lng,
        this.markerDestiny.lat,
        this.markerDestiny.lng
      );

      if (distanciaDestino < 200) {
        console.log('Finalizó el destino');
        this.mssg = 'Finalizó el destino';
        this.finalizo = true;
        this.timestampText = Date.now();
      }

      if (
        this.previousPoint &&
        this.calcularDistancia(
          this.previousPoint.lat,
          this.previousPoint.lng,
          this.currentPoint.lat,
          this.currentPoint.lng
        ) >= 200
      ) {
        this.previousPoint = this.currentPoint;
      }

      if (
        this.previousPoint &&
        this.calcularDistancia(
          this.previousPoint.lat,
          this.previousPoint.lng,
          this.currentPoint.lat,
          this.currentPoint.lng
        ) < 200
      ) {
        console.log('Próximo a 200 metros del punto anterior');
        this.mssg = 'Próximo a 200 metros del punto anterior';
        this.timestampText = Date.now();
      }
    }
  }

  //?matar la obtencion de coordenadas
  detenerSeguimiento() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = undefined;
    }
  }

  //*-----------------------------------------------------------------------

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

      //console.log('se ha guardado');
    }

    return distancia;
  }

  toRad(grados: any) {
    return (grados * Math.PI) / 180;
  }
}
