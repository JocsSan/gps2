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

  points: any;

  constructor() {}
  ngOnDestroy(): void {
    this.map.remove();
  }
  ngAfterViewInit(): void {
    setTimeout(() => this.mapboxinit(), 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    const currentPoint = changes['currentPoint'].currentValue;
    const center = changes['center'].currentValue;
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

  mapboxinit() {
    (mapboxgl as any).accessToken =
      'pk.eyJ1Ijoiam9jc3Nhbjk4IiwiYSI6ImNsaW9xNDZ6ZjB2bWIzZnRodTc0aDE4OXEifQ.oL3GaxTxdYoHCgWw80BL_A';

    this.map = new mapboxgl.Map({
      container: 'mapabox', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [this.destiniyPoint.lng, this.destiniyPoint.lat], // starting position
      zoom: 16, // starting zoom
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
                  // feature for Mapbox DC
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
              // get the title name from the source's "title" property
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

      //start

      //adding end

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
          'circle-color': '#f30',
        },
      });
    });
  }

  async actualizarPuntos() {
    //console.log('actualizarPuntos');

    const source = this.map?.getSource('line');
    //console.log(source);

    if (source) {
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

      //console.log('calculo final', ruta);
      this.map.flyTo({
        center: [this.currentPoint.lng, this.currentPoint.lat],
        zoom: 16,
        speed: 1.5,
        curve: 1,
      });

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
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    //console.log('objeto', data);
    const route = data.geometry.coordinates;

    return route;
    // Actualiza el GeoJSON de la ruta en el mapa
  }

  // Llama a la función obtenerRutaOptima con los puntos de inicio y fin deseados
}
