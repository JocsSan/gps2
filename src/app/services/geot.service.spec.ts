import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { GeotService } from './geot.service';
import { Listado } from '../interfaces/listados.interface';

describe('GeotService', () => {
  let service: GeotService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeotService],
    });

    service = TestBed.inject(GeotService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getListado() should return data', () => {
    const dummyData: Listado[] = [
      {
        Orden: 1,
        Cliente: 'T115759',
        NomCliente: 'PULPERIA IKER',
        Contacto: 'WILMER CERNA',
        Telefono: 'NULL',
        Direccion: 'COL. CALPULES CALLE PRINCIPAL ANTES DE PULP. FLORES',
        Lat: '14.06906730460502',
        Lon: '-87.18476310609161',
        EstadoEntrega: '0',
        Chofer: 'Jose',
        Fecha: new Date('2021-06-01T00:00:00.000Z'),
        HoraSalida: '08:00:00',
        KmRecorridos: 0,
        Enlistamiento: 'T115759',
        PrecioPorKm: 0,
        RutaOriginal: 0,
        keyEntrega: 'T115759',
        Factura: 'NULL',
        HoraAPI: 'NULL',
        HoraEstimadaLlegada: 'NULL',
        HoraEstimadaSalida: 'NULL',
        HoraLlegada: 'NULL',
        HorarioAtencion: 'NULL',
        TiempoAdicional: 'NULL',
        TiempoPromEntrega: 'NULL',
      },
      {
        Orden: 2,
        Cliente: 'T115769',
        NomCliente: 'MERCADITO MEMA',
        Contacto: 'JOSE FELIPE MARTINEZ MEJIA',
        Telefono: 'NULL',
        Direccion: 'COL. SAN JOSE LA PEA ZONA D BLOQUE 2',
        Lat: '15.468077',
        Lon: '-87.962137',
        EstadoEntrega: '0',
        Chofer: 'Jose',
        Fecha: new Date('2021-06-01T00:00:00.000Z'),
        HoraSalida: '08:00:00',
        KmRecorridos: 0,
        Enlistamiento: 'T115769',
        PrecioPorKm: 0,
        RutaOriginal: 0,
        keyEntrega: 'T115769',
        Factura: 'NULL',
        HoraAPI: 'NULL',
        HoraEstimadaLlegada: 'NULL',
        HoraEstimadaSalida: 'NULL',
        HoraLlegada: 'NULL',
        HorarioAtencion: 'NULL',
        TiempoAdicional: 'NULL',
        TiempoPromEntrega: 'NULL',
      },
    ];

    service.getListado('test_code').subscribe((data) => {
      expect(data.length).toBe(1);
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(
      `${service.urlGeot}ruta-logica/get-enlistamiento`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });
});
