import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcularDistancia',
})
export class CalcularDistanciaPipe implements PipeTransform {
  transform(lat1: number, lon1: number, lat2: string, lon2: string): number {
    const radioTierra = 6371000;
    const dLat = this.toRad(Number.parseFloat(lat2) - lat1);
    const dLon = this.toRad(Number.parseFloat(lon2) - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(Number.parseFloat(lat2))) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = radioTierra * c;

    return distancia;
  }

  private toRad(grados: number): number {
    return (grados * Math.PI) / 180;
  }
}
