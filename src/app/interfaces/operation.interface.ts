// operacion.interface.ts

import { Listado } from './listados.interface';

export interface OperacionUpdateOrder {
  operation: 'update_order';
  id: string;
  estado_entrega: number;
  hora_salida: string;
  hora_llegada: string;
  tiempo_entrega: string;
  original_object: Listado;
}

export interface OperacionInsertLocation {
  operation: 'insert_location';
  enlistamiento: string;
  lat: number;
  lon: number;
  timestamps: string;
}

export type Operacion = OperacionUpdateOrder | OperacionInsertLocation;
