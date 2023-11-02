import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-mapbox-map',
  templateUrl: './mapbox-map.component.html',
  styleUrls: ['./mapbox-map.component.scss'],
})
export class MapboxMapComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() destiniyPoint!: { lng: number; lat: number };
  @Input() currentPoint!: { lat: number; lng: number };
  @Input() center!: { lat: number; lng: number };

  map: any;
  geojson: any;

  lat: any;
  lng: any;

  rutaOptimaCache = [];

  labelTest!: any;

  constructor() {}

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mapboxinit();
      this.fliying();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    const currentPoint = changes['currentPoint']?.currentValue;
    const center = changes['center']?.currentValue;
    if (
      !changes['center']?.firstChange &&
      !changes['currentPoint']?.firstChange
    ) {
      this.actualizarPuntos();
    }
  }

  ngOnInit() {
    console.log(this.center, this.currentPoint, this.destiniyPoint);
  }

  /**
   * Initializes the Mapbox configuration and sets up the map.
   * This method configures various options for the map, adds sources and layers, and sets up map controls.
   *@description: Funcion que inicaliza la configuracion de mapbox, gracias codeium, eres el creador de esta funcion
   * @return {void}
   */
  mapboxinit() {
    (mapboxgl as any).accessToken =
      'pk.eyJ1Ijoiam9jc3Nhbjk4IiwiYSI6ImNsaW9xNDZ6ZjB2bWIzZnRodTc0aDE4OXEifQ.oL3GaxTxdYoHCgWw80BL_A';

    this.map = new mapboxgl.Map({
      container: 'mapabox',
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [this.destiniyPoint.lng, this.destiniyPoint.lat],
      zoom: 16,
    });

    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      // Add a GeoJSON source with a line feature
      this.map.addSource('line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [this.destiniyPoint.lng, this.destiniyPoint.lat],
              [this.currentPoint.lng, this.currentPoint.lat],
            ],
          },
        },
      });

      this.map.loadImage(
        '/assets/icons/grabar.png',
        (error: any, image: any) => {
          if (error) throw error;
          this.map.addImage('custom-marker', image);

          // Add a GeoJSON source with 2 points
          this.map.addSource('points', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [this.currentPoint.lng, this.currentPoint.lat],
                  },
                  properties: {
                    title: `Mapbox Current Point ${this.currentPoint.lat}  ${this.currentPoint.lng}`,
                  },
                },
              ],
            },
          });

          // Add a symbol layer
          this.map.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'points',
            layout: {
              'icon-image': 'custom-marker',
              'text-field': ['get', 'title'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.25],
              'text-anchor': 'top',
            },
          });
        }
      );

      // Add a layer for the line
      this.map.addLayer({
        id: 'line',
        type: 'line',
        source: 'line',
        paint: {
          'line-color': '#ff0000',
          'line-width': 8,
        },
      });

      this.map.addLayer({
        id: 'end',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: [this.destiniyPoint.lng, this.destiniyPoint.lat],
                },
              },
            ],
          },
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#6041FA',
        },
      });
    });
  }

  fliying() {
    this.map.flyTo({
      center: [this.currentPoint.lng, this.currentPoint.lat],
      zoom: 16,
      speed: 1.5,
      curve: 1,
    });
  }

  flyingbool = false;

  cambiarEstado(): void {
    this.fliying();
    this.flyingbool = !this.flyingbool;
  }

  async actualizarPuntos() {
    const source = this.map?.getSource('line');
    //console.log(source);
    const source2 = this.map?.getSource('points');
    if (source || source2) {
      this.map.getSource('points').setData({
        type: 'FeatureCollection',
        features: [
          {
            // feature for Mapbox DC
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [this.currentPoint.lng, this.currentPoint.lat],
            },
            properties: {
              title: `Mapbox Current Point new ${this.currentPoint.lng} & ${this.currentPoint.lat}`,
            },
          },
        ],
      });

      if (this.flyingbool) {
        this.fliying();
      }

      //console.log('calculo final', ruta);
      const ruta = await this.obtenerRutaOptima(
        [this.currentPoint.lng, this.currentPoint.lat],
        [this.destiniyPoint.lng, this.destiniyPoint.lat]
      );

      const lineFeature = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: ruta,
        },
      };

      this.map.getSource('line').setData(lineFeature);

      //?new point
      const end = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [this.currentPoint.lng, this.currentPoint.lat],
            },
          },
        ],
      };
    }
  }

  async obtenerRutaOptima(start: any, end: any) {
    const currentLat =
      this.currentPoint.lat; /* Obtener la latitud de la ubicación actual */
    const currentLng =
      this.currentPoint.lng; /* Obtener la longitud de la ubicación actual */
    const previousResponse = this.rutaOptimaCache;

    if (previousResponse?.length == 0) {
      // No hay una respuesta anterior, realizar la primera solicitud al API
      console.log('Realizando la primera solicitud al API...');
      this.labelTest = Date.now();
      const ruta = await this.getRuta(start, end);
      this.rutaOptimaCache = ruta;
      return ruta;
    } else {
      // Verificar la distancia entre la ubicación actual y el primer punto de la respuesta anterior
      const referenceLat = previousResponse[0][1]; // Latitud del primer punto de la respuesta anterior
      const referenceLng = previousResponse[0][0]; // Longitud del primer punto de la respuesta anterior

      const distance = this.calcularDistancia(
        currentLat,
        currentLng,
        referenceLat,
        referenceLng
      );
      if (distance <= 200) {
        // La ubicación actual está dentro del radio de 200 km del primer punto de la respuesta anterior
        console.log('La ubicación actual está dentro del radio establecido.');
        return previousResponse;
      } else {
        // La ubicación actual está fuera del radio de 200 km del primer punto de la respuesta anterior
        console.log(
          'La ubicación actual está fuera del radio establecido. Actualizando las rutas...'
        );

        this.labelTest = Date.now();

        const ruta = await this.getRuta(start, end);
        this.rutaOptimaCache = ruta;
        return ruta;
      }
    }
  }

  async getRuta(start: any, end: any) {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    return route;
  }

  //calculo de distancia
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
      //console.log('se ha guardado');
    }

    return distancia;
  }

  toRad(grados: any) {
    return (grados * Math.PI) / 180;
  }

  // Llama a la función obtenerRutaOptima con los puntos de inicio y fin deseados
}
