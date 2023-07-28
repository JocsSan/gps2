import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Listado } from 'src/app/interfaces/listados.interface';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private geolocation$: GeolocationService,
    private storage$: StorageService
  ) {}
  private subscripciones: { [key: string]: Subscription } = {};

  listadoClientes!: Listado[];

  orderTake!: Listado;

  ngOnInit() {
    this.getseguimiento();
    this.getListado();
    this.getOrder();
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
    this.subscripciones['getOrderObservable'] = this.storage$
      .getOrderObservable()
      .subscribe(
        (res) => {
          this.orderTake = res;
        },
        (err) => {
          console.log(err);
        }
      );
  };

  detenerSeguimiento() {
    this.geolocation$.detenerSeguimiento();
  }

  listenerInternet() {}

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
      this.listadoClientes = this.listado;
      this.storage$.set('listado', this.listado);
    }
  }

  navigateToDestination(dataToSend: any): void {
    this.storage$.set('cliente', dataToSend);
    localStorage.setItem('cliente', JSON.stringify(dataToSend));
    this.router.navigate(['home/map']);
  }

  nuevaPosition: { lat: number; lng: number } = { lat: 0, lng: 0 };

  getseguimiento() {
    this.subscripciones['geolocation'] = this.geolocation$
      .getPositionObservable()
      .subscribe(
        (position) => {
          this.nuevaPosition = position;
          // Aquí puedes utilizar la posición actualizada
          console.log(position);
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

  listado: any = [
    {
      Orden: 1,
      Cliente: 'T115759',
      NomCliente: 'PULPERIA IKER',
      Contacto: 'WILMER CERNA',
      Telefono: 'NULL',
      Direccion: 'COL. CALPULES CALLE PRINCIPAL ANTES DE PULP. FLORES',
      Lat: 15.466383,
      Lon: -87.961358,
      EstadoEntrega: '0',
    },
    {
      Orden: 2,
      Cliente: 'T115769',
      NomCliente: 'MERCADITO MEMA',
      Contacto: 'JOSE FELIPE MARTINEZ MEJIA',
      Telefono: 'NULL',
      Direccion: 'COL. SAN JOSE LA PEA ZONA D BLOQUE 2',
      Lat: 15.468077,
      Lon: -87.962137,
      EstadoEntrega: '0',
    },
    {
      Orden: 3,
      Cliente: 'T115772',
      NomCliente: 'PULPERIA ENEiDA',
      Contacto: 'ENEYDA ELIZABETH SOSA MARADIAGA',
      Telefono: 'NULL',
      Direccion:
        'COL. SAN JOSE DE LA PEA SUBIENDO LA CUESTA DE LOS BOMBEROS A MANO IZQUIERDA DEL PARQUEO LA 5TA CASA',
      Lat: 15.465421,
      Lon: -87.961327,
      EstadoEntrega: '0',
    },
    {
      Orden: 4,
      Cliente: 'T109955',
      NomCliente: 'CAR WASH RUSTICO',
      Contacto: 'CAR WASH RUSTICO',
      Telefono: '0',
      Direccion:
        'SAN JOSE DE LA EGA ,DESPUES DE PUENTE CONTIGUO A PLANTEL DE HONDUTEL',
      Lat: 14.063752,
      Lon: -87.200963,
      EstadoEntrega: '0',
    },
    {
      Orden: 5,
      Cliente: 'T109232',
      NomCliente: 'ECONOMARKET',
      Contacto: 'ANGEL JOSE VILLATORO FIALLOS',
      Telefono: 'NULL',
      Direccion: 'CLL PRINPAL FTEA LACTEOS MIRAFLORES',
      Lat: 14.072696,
      Lon: -87.19375,
      EstadoEntrega: '0',
    },
    {
      Orden: 6,
      Cliente: 'T115949',
      NomCliente: 'INVERSIONES VILLASER',
      Contacto: 'ANGEL JOSE VILLATORO FIALLOS',
      Telefono: '9791-2797',
      Direccion:
        'COL.MIRAFLORES CALLE PRINCIPAL,ESQUINA OPUESTA A FARMACIA MIRAFLORES',
      Lat: 14.072091,
      Lon: -87.189975,
      EstadoEntrega: '0',
    },
    {
      Orden: 7,
      Cliente: 'T116015',
      NomCliente: 'MINI MERCADITO CRISTIAN DIEGO',
      Contacto: 'RENAN TEJEDA BUSTILLO',
      Telefono: 'NULL',
      Direccion: 'DOS CUADRAS ARRIBA DE FARMACIA EL AHORRO',
      Lat: 14.07182,
      Lon: -87.189845,
      EstadoEntrega: '0',
    },
    {
      Orden: 8,
      Cliente: 'T115505',
      NomCliente: 'PULPERIA SAN MIGUEL',
      Contacto: 'OMAR JAVIER LANDA ZEPEDA',
      Telefono: 'NULL',
      Direccion:
        'TEGUCIGALPA COL. LAS COLONIAS ATRAS DE IGLESIA VIDA ABUNDANTE',
      Lat: 14.077081,
      Lon: -87.192171,
      EstadoEntrega: '0',
    },
    {
      Orden: 9,
      Cliente: 'T115506',
      NomCliente: 'MERCADITO EL LIMONCITO',
      Contacto: 'STEFANY PONCE',
      Telefono: 'NULL',
      Direccion: 'TEGUCIGALPA COL LAS COLINAS FRENTE A MERCADITO LAS COLOINAS',
      Lat: 14.077876,
      Lon: -87.194096,
      EstadoEntrega: '0',
    },
    {
      Orden: 10,
      Cliente: 'T115507',
      NomCliente: 'PULPERIA XAFRAHU',
      Contacto: 'ALBA FLORES ZAVALA',
      Telefono: 'NULL',
      Direccion:
        'TEGUCIGALPA FRANCISCO MORAZAN COL.LAS COLINAS BQ Y C#3303 2 CDRA ABAJO VIDA ABUNDANTE',
      Lat: 14.078096,
      Lon: -87.194917,
      EstadoEntrega: '0',
    },
    {
      Orden: 11,
      Cliente: 'T115504',
      NomCliente: 'MERCADITO LAS CAMILAS',
      Contacto: 'YESLIN CLAUDETH MARADIAGA MERCADO',
      Telefono: 'NULL',
      Direccion: 'COL. COLINAS CONTIGUO POLLO EL PASO',
      Lat: 14.078578,
      Lon: -87.18846,
    },
    {
      Orden: 12,
      Cliente: 'T114977',
      NomCliente: 'GOLOSINAS FRANCISCO',
      Contacto: 'FRANCISCO RIVAS',
      Telefono: 'NULL',
      Direccion: 'FTE A OFICINAS CANAL AZTECA',
      Lat: 14.088918,
      Lon: -87.17599,
      EstadoEntrega: '0',
    },
    {
      Orden: 13,
      Cliente: 'T114970',
      NomCliente: 'MERCADITO ANETTE',
      Contacto: 'YESSENIA WALESKA HERNANDEZ RUBI',
      Telefono: 'NULL',
      Direccion: 'FINAL DEL BLVD MORAZAM',
      Lat: 14.101156,
      Lon: -87.176548,
      EstadoEntrega: '0',
    },
    {
      Orden: 14,
      Cliente: 'T115114',
      NomCliente: 'PULPERIA NAVAS',
      Contacto: 'ERIKA NAVAS',
      Telefono: 'NULL',
      Direccion:
        'COMAYAGUELA FRANCISCO MORAZAN NUEVA SUYAPA SECT 1 1 CALLE CASA DE ESQUINA',
      Lat: 14.07788,
      Lon: -87.158544,
      EstadoEntrega: '0',
    },
    {
      Orden: 15,
      Cliente: 'T115110',
      NomCliente: 'PULPERIA VARIEDADES CELESTE',
      Contacto: '8011993106320',
      Telefono: 'NULL',
      Direccion: 'COLONIA NUEVA SUYAPA SECTOR MATUTE',
      Lat: 14.077803,
      Lon: -87.156387,
      EstadoEntrega: '0',
    },
    {
      Orden: 16,
      Cliente: 'T115106',
      NomCliente: 'PULPERIA ABEL',
      Contacto: 'CLAUDIA CECILIA SOSA CABRERA',
      Telefono: 'NULL',
      Direccion:
        'COLONIA NUEVA SUYAPA CALLAE PRINCIPAL SECTOR 2 ARRIBA DE PULPERIA PALMIRA',
      Lat: 14.074564,
      Lon: -87.156211,
      EstadoEntrega: '0',
    },
    {
      Orden: 17,
      Cliente: 'T116107',
      NomCliente: 'PULPERIA EL COLOCHO',
      Contacto: 'OSCAR ORLANDO FLORES CERRATO',
      Telefono: 'NULL',
      Direccion: 'SECTOR UNIVERSIDAD FTE AL ANTIGUO CENTRO SALUD',
      Lat: 14.0755929,
      Lon: -87.1522334,
      EstadoEntrega: '0',
    },
    {
      Orden: 18,
      Cliente: 'T115103',
      NomCliente: 'PULPERIA KARLA',
      Contacto: 'RAMON EUCEDA',
      Telefono: 'NULL',
      Direccion: 'CLL PRINPAL 5CASAS ADELANTE PUL.ARACELY',
      Lat: 14.074379,
      Lon: -87.147353,
      EstadoEntrega: '0',
    },
    {
      Orden: 19,
      Cliente: 'T115117',
      NomCliente: 'PULPERIA MARY',
      Contacto: '0810196500155...',
      Telefono: 'NULL',
      Direccion: 'TEGUCIGALPA FRANCISCO MORAZAN COL.HATO DE ENMEDIO SECTOR 9',
      Lat: 14.07089,
      Lon: -87.165262,
      EstadoEntrega: '0',
    },
    {
      Orden: 20,
      Cliente: 'T115116',
      NomCliente: 'MERCADITO CHENG',
      Contacto: 'NTI',
      Telefono: 'NULL',
      Direccion: 'TEGUCIGALPA COL.HATO SECTOR 10 FRENTE AL PUENTE PEATONAL.',
      Lat: 14.070087,
      Lon: -87.16631,
      EstadoEntrega: '0',
    },
    {
      Orden: 21,
      Cliente: 'T115116',
      NomCliente: 'MERCADITO CHENG',
      Contacto: 'NTI',
      Telefono: 'NULL',
      Direccion: 'TEGUCIGALPA COL.HATO SECTOR 10 FRENTE AL PUENTE PEATONAL.',
      Lat: 14.070087,
      Lon: -87.16631,
      EstadoEntrega: '0',
    },
    {
      Orden: 22,
      Cliente: 'T115757',
      NomCliente: 'GLOBAL MARKET',
      Contacto: '4011989004680',
      Telefono: 'NULL',
      Direccion: 'TEGUCIGALPA JARDINES DE LOARQUE SALIDA AL ANILLO PERIFERICO',
      Lat: 14.041674,
      Lon: -87.20481,
      EstadoEntrega: '0',
    },
    {
      Orden: 23,
      Cliente: 'T113911',
      NomCliente: 'PULPERIA DON DANILO',
      Contacto: '7151970001523',
      Telefono: 'NULL',
      Direccion: 'COL. RIO GRANDE BLOQUE N#1 CASA #1001',
      Lat: 14.041892,
      Lon: -87.20634,
      EstadoEntrega: '0',
    },
    {
      Orden: 24,
      Cliente: 'T105099',
      NomCliente: 'MERCADITO SUYAPA',
      Contacto: '6111977003053',
      Telefono: '27743402',
      Direccion:
        'COL. RIO GRANDE, FRENTE AL PUNTO DE TAXIS DE LOARQUE Y FRENT A CATOLICA',
      Lat: 14.04222,
      Lon: -87.208829,
      EstadoEntrega: '0',
    },
    {
      Orden: 25,
      Cliente: 'T115698',
      NomCliente: 'PULPERIA NICOL',
      Contacto: '9011969002580',
      Telefono: 'NULL',
      Direccion: 'COL. LOMAS DE TOCONTIN MEDIA CUADRA DE BUEN PASTOR',
      Lat: 14.039601,
      Lon: -87.221306,
      EstadoEntrega: '0',
    },
    {
      Orden: 26,
      Cliente: 'T115691',
      NomCliente: 'LA ESTACION',
      Contacto: 'SAUL ARMANDO ZEPEDA CASTELLANOS',
      Telefono: 'NULL',
      Direccion:
        'TEGUCIGALPA RES. LAS HADAS EN EL CENTRO COMERCIALFRENTE AL ANILLO',
      Lat: 14.041442,
      Lon: -87.232691,
      EstadoEntrega: '0',
    },
    {
      Orden: 27,
      Cliente: 'T115689',
      NomCliente: 'MERCADITO CRISTO REY',
      Contacto: '6011974021341',
      Telefono: 'NULL',
      Direccion:
        'COL. LAS HADAS CALLE PRINCIPAL 1/2 CUADRA ARRIBA DE MERCADITO CIPRES',
      Lat: 14.046751,
      Lon: -87.2327,
      EstadoEntrega: '0',
    },
    {
      Orden: 28,
      Cliente: 'T115687',
      NomCliente: 'MERCADITO CIPRES',
      Contacto: 'ARACELY VASQUEZ',
      Telefono: 'NULL',
      Direccion:
        'COL. LAS HADAS 1/2 CUADRA ABAJO E MERCADITO JANANIA CALLE PRINCIPAL',
      Lat: 14.047788,
      Lon: -87.232802,
      EstadoEntrega: '0',
    },
    {
      Orden: 29,
      Cliente: 'T115998',
      NomCliente: 'MERCADITO FENIX',
      Contacto: 'FRANKLIN EVEL NUÑEZ CORRALES',
      Telefono: 'NULL',
      Direccion: 'CALLE PRINCIPAL, FTE. A RESTADORA DE CARROS HERTZ',
      Lat: 14.0506124,
      Lon: -87.2297661,
      EstadoEntrega: '0',
    },
    {
      Orden: 30,
      Cliente: 'T115683',
      NomCliente: 'MERCADITO LAS ACACIAS',
      Contacto: '0801200113424...',
      Telefono: 'NULL',
      Direccion:
        'RESIDENCIAL CASCADAS CALLE PRINCIPAL 1/2 CUADRA ANTES DE MERC. CONCORDIA',
      Lat: 14.053622,
      Lon: -87.233204,
      EstadoEntrega: '0',
    },
    {
      Orden: 31,
      Cliente: 'T115682',
      NomCliente: 'SUPERMERCADO CONCORDIA',
      Contacto: 'YADIRA MARIBONE TORRES ACOSTA',
      Telefono: 'NULL',
      Direccion: 'COMAYAGUELA RES.LA CASCADA CLL.1C-S/NCLL.PPL.',
      Lat: 14.053662,
      Lon: -87.234567,
      EstadoEntrega: '0',
    },
    {
      Orden: 32,
      Cliente: 'T115678',
      NomCliente: 'MERCADITO SHADDAI',
      Contacto: 'PAULA GISSELA PAVON DIAZ',
      Telefono: 'NULL',
      Direccion: 'FTE A ESCUELA PUBLICA LOS ROBLES',
      Lat: 14.056197,
      Lon: -87.237011,
      EstadoEntrega: '0',
    },
    {
      Orden: 33,
      Cliente: 'T105254',
      NomCliente: 'MERCADITO EL ROBLE',
      Contacto: '716199300285',
      Telefono: 'NULL',
      Direccion: 'COL ROBLE OESTE CL PPAL BL K 5 CDRAS DESPUES DE RES LAS CASC',
      Lat: 14.052463,
      Lon: -87.240829,
      EstadoEntrega: '0',
    },
  ];

  isToastOpen = false;

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
