import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Coordenadas } from 'src/app/interfaces/coordenadas.interface';
import { Listado } from 'src/app/interfaces/listados.interface';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { PostOfflinerService } from 'src/app/services/post-offliner.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private geolocation$: GeolocationService,
    private storage$: StorageService,
    private postOffline$: PostOfflinerService
  ) {}
  private subscripciones: { [key: string]: Subscription } = {};

  listadoClientes!: Listado[];

  orderTake!: Listado;

  currentPoint: Coordenadas = { lat: 0, lng: 0 };

  lasPoint: Coordenadas = { lat: 0, lng: 0 };

  markerDestiny: Coordenadas = { lat: 0, lng: 0 };

  isToastOpen = false;

  cambioDistancias!: number;

  ngOnInit() {
    this.getseguimiento();
    this.getListado();

    setInterval(() => {
      this.getOrder();
    }, 1000);
  }

  ngOnDestroy(): void {
    Object.keys(this.subscripciones).forEach((key) => {
      try {
        this.subscripciones[key].unsubscribe();
      } catch (error) {
        console.log(error);
      }
    });

    console.log('se destruyo');
    this.detenerSeguimiento();
  }

  getOrder = async () => {
    //? Metodo para obtener orden tomada en caso de ya haber sido usada
    this.orderTake = await this.storage$.get('take_order');
    if (this.subscripciones['getOrderObservable']) {
      this.subscripciones['getOrderObservable'].unsubscribe();
    }

    this.subscripciones['getOrderObservable'] = this.storage$
      .getOrderObservable()
      .subscribe(
        async (res) => {
          console.log('res', res);
          this.orderTake = res;
          const orderChange = this.orderTake;
          console.log('orderChange', orderChange);
          if (
            this.orderTake.EstadoEntrega == '4' ||
            this.orderTake.EstadoEntrega == '3'
          ) {
            await this.storage$.updateOrders(orderChange);
            this.storage$.updateCliente(orderChange);
            console.log('a limpiar', this.orderTake);
            this.listadoClientes = await this.storage$.get('listado');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  };

  detenerSeguimiento() {
    this.geolocation$.detenerSeguimiento();
  }

  async getListado() {
    const previusListado = await this.storage$.get('listado');
    if (previusListado) {
      console.log(previusListado);
      previusListado.map((item: Listado) => {
        this.storage$.set(item.Cliente || '', item);
        return item;
      });
      this.listadoClientes = previusListado;
    } else {
      //! es para pruebas
      // this.listadoClientes = this.listado;
      // this.storage$.set('listado', this.listado);
    }
  }

  async navigateToDestination(dataToSend: Listado) {
    this.storage$.set('cliente', dataToSend);
    //localStorage.setItem('cliente', JSON.stringify(dataToSend));
    await this.storage$.setClient(dataToSend);
    this.router.navigate(['home/map']);
  }

  async getseguimiento() {
    const cliente: Listado = await this.storage$.get('take_order');

    this.subscripciones['geolocation'] = this.geolocation$
      .getPositionObservable()
      .subscribe(
        (position) => {
          this.currentPoint = position;
          this.markerDestiny = {
            lat: parseInt(cliente?.Lat || '0'),
            lng: parseInt(cliente?.Lon || '0'),
          };
          this.cambioDistancias = this.calcularDistancia(
            this.currentPoint?.lat,
            this.currentPoint?.lng,
            this.markerDestiny?.lat,
            this.markerDestiny?.lng
          );
          // Aquí puedes utilizar la posición actualizada
          if (this.currentPoint.lat) {
            this.verDistancias();
          }
        },
        (error) => {
          // Manejo de errores
          console.error(error);
        }
      );
  }

  disabledOrdes = () => {
    const order = this.orderTake.Cliente || '';
    return { status: order === '' ? true : false, order: order };
  };

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  // aqui los que estan en 0 es por que el punto destino no existe de mometo
  verDistancias() {
    if (!this.lasPoint) {
      this.lasPoint = {
        lat: this.currentPoint.lat,
        lng: this.currentPoint.lng,
      };
      console.log('le agregamos el primer las point');
      this.postPoint(this.lasPoint);

      if (this.markerDestiny.lat == 0) {
        this.postPoint(this.lasPoint);
      }
    }

    if (this.lasPoint) {
      if (this.markerDestiny.lat == 0) {
        this.postPoint(this.lasPoint);
      }
      const currentdistance = this.calcularDistancia(
        this.currentPoint.lat,
        this.currentPoint.lng,
        this.lasPoint.lat,
        this.lasPoint.lng
      );

      if (this.cambioDistancias <= 200) {
        console.log('llego al punto final');
        this.finalPoint(this.currentPoint);
        return;
      }

      if (currentdistance > environment.changeDistance) {
        console.log('guardar punto');
        this.lasPoint = {
          lat: this.currentPoint.lat,
          lng: this.currentPoint.lng,
        };
        this.postPoint(this.lasPoint);
      }
    }
  }

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

    return distancia;
  }

  toRad(grados: number) {
    return (grados * Math.PI) / 180;
  }

  async finalPoint(coordenadas: { lat: number; lng: number }) {
    //TODO: mandar los puntos
    const res = await this.postOffline$.finalPoint(coordenadas);
    console.log(res);
  }

  async postPoint(coordenadas: { lat: number; lng: number }) {
    //TODO: mandar los puntos
    const res = await this.postOffline$.postPoint(coordenadas);
    console.log(environment.changeDistance);
    console.log('post de index', res);
    console.log(res);
  }

  async validateOrder(cliente: string): Promise<boolean> {
    const orderTake: Listado = await this.storage$.get('take_order');
    if (orderTake?.Cliente === cliente) {
      return true;
    }
    return false;
  }
}
