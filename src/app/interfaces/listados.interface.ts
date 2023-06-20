export interface Listado {
  Enlistamiento: string[];
  Chofer: string;
  Fecha: Date;
  HoraSalida: string[];
  KmRecorridos: number;
  PrecioPorKm: number;
  RutaOriginal: number;
  keyEntrega: string;
  Factura: string;
  Orden: number;
  Cliente: string;
  NomCliente: string;
  Contacto: string;
  Telefono: null | string;
  Direccion: string;
  Lat: string;
  Lon: string;
  HoraAPI: string;
  HorarioAtencion: null;
  TiempoPromEntrega: null;
  TiempoAdicional: string;
  HoraLlegada: string;
  HoraEstimadaLlegada: string;
  HoraEstimadaSalida: string;
  EstadoEntrega: string;
}
