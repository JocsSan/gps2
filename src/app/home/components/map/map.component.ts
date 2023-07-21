import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { ActionSheetController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { PostOfflinerService } from 'src/app/services/post-offliner.service';
import { Razon } from 'src/app/interfaces/razones.interface';

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
  receivedData!: any;

  //*variables de mapa-------------------------------
  cambioDistancias!: number;

  //?variables de puntos de mapa

  markerDestiny!: { lat: number; lng: number };

  currentPoint!: { lat: number; lng: number };

  center!: { lat: number; lng: number };

  previousPoint!: { lat: number; lng: number };

  //?--------------------------

  selectedOption!: string;
  inputValue!: string;

  timestampText: any;

  mssg!: string;

  finalizo: boolean = false;

  lasPoint!: { lat: number; lng: number };
  //*------------------------------------------------

  valueInput: string = 'alguna mierda';

  presentingElement: any;

  razones!: Razon[];

  constructor(
    private geolocation$: GeolocationService,
    private actionSheetCtrl: ActionSheetController,
    private storage$: StorageService,
    private posttworker$: PostOfflinerService
  ) {}

  async ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.getseguimiento();
    this.receivedData = null;

    this.razones = await this.getRazones();

    const cliente = await this.getclienteDb();
    //    const localCliente = localStorage.getItem('cliente');
    if (cliente) {
      this.receivedData = cliente;
      this.markerDestiny = {
        lat: this.receivedData.Lat,
        lng: this.receivedData.Lon,
      };
    }

    this.getseguimiento();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy() {
    this.receivedData = null;
    localStorage.removeItem('cliente');
    Object.keys(this.subscripciones).forEach((key) => {
      try {
        this.subscripciones[key].unsubscribe();
        console.log('key', key);
      } catch (error) {
        console.log(error);
      }
    });

    this.detenerSeguimiento();
  }

  async getRazones(): Promise<Razon[]> {
    try {
      const res = await this.storage$.get('razones');
      return res as Razon[];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  //?---botones del alert

  handleInputChange(event: CustomEvent) {
    const inputValue = event.detail.value;
    // Hacer algo con el valor del campo de entrada
    console.log('Valor actual del campo de entrada:', inputValue);
  }

  //?-----------------------

  async getclienteDb() {
    const cliente = await this.storage$.get('cliente');
    return cliente;
  }

  //*--------------------------------------------------------------------

  //?obtencion de coordenadas

  getseguimiento() {
    this.subscripciones['geolocation'] = this.geolocation$
      .getPositionObservable()
      .subscribe(
        (positionObs: { lat: number; lng: number }) => {
          // Aquí puedes utilizar la posición actualizada
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
            this.verDistancias();
          }
        },
        (error) => {
          // Manejo de errores
          console.error(error);
        }
      );
  }

  verDistancias() {
    // Verificar si currentPoint y markerDestiny no son nulos o indefinidos

    if (!this.lasPoint) {
      this.lasPoint = {
        lat: this.currentPoint.lat,
        lng: this.currentPoint.lng,
      };
      console.log('le agregamos el primer las point');

      this.mssg = 'primer punto';
      this.timestampText = Date.now();
      this.postPoint(this.lasPoint);
    }

    if (this.lasPoint) {
      const currentdistance = this.calcularDistancia(
        this.currentPoint.lat,
        this.currentPoint.lng,
        this.lasPoint.lat,
        this.lasPoint.lng
      );

      if (this.cambioDistancias <= 200) {
        console.log('llego al punto final');
        this.mssg = 'esta en el punto final';
        this.timestampText = Date.now();
        this.finalPoint(this.currentPoint);
        return;
      }

      if (currentdistance > 500) {
        console.log('guardar punto');
        this.lasPoint = {
          lat: this.currentPoint.lat,
          lng: this.currentPoint.lng,
        };

        this.mssg = 'un punto cualquiera';
        this.timestampText = Date.now();
        this.postPoint(this.lasPoint);
      }
    }
  }

  finalPoint(coordenadas: { lat: number; lng: number }) {
    const res = this.posttworker$.finalPoint();
    console.log(res);
  }

  postPoint(coordenadas: { lat: number; lng: number }) {
    const res = this.posttworker$.postPoint();
    console.log(res);
  }

  //?matar la obtencion de coordenadas
  detenerSeguimiento() {
    this.geolocation$.detenerSeguimiento();
  }

  //*-----------------------------------------------------------------------

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

  toRad(grados: number) {
    return (grados * Math.PI) / 180;
  }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };

  submitForm() {
    console.log('Opción seleccionada:', this.selectedOption);
    console.log('Valor del campo de entrada:', this.inputValue);
  }
}
