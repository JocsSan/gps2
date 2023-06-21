import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-mapbox-map',
  templateUrl: './mapbox-map.component.html',
  styleUrls: ['./mapbox-map.component.scss'],
})
export class MapboxMapComponent implements OnInit, AfterViewInit {
  @Input() destiniyPoint!: { lng: number; lat: number };
  @Input() currentPoint!: { lat: number; lng: number };
  @Input() center!: { lat: number; lng: number };

  map: any;
  geojson: any;

  lat: any;
  lng: any;

  constructor() {}
  ngAfterViewInit(): void {
    setTimeout(() => this.mapboxinit(), 500);
  }

  /*
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    const currentPoint = changes['currentPoint'].currentValue;
    const center = changes['center'].currentValue;
    console.log(
      !changes['center']?.firstChange && !changes['currentPoint']?.firstChange
    );
    console.log('first cahnge: ', changes['currentPoint']?.firstChange);

    if (
      !changes['center']?.firstChange &&
      !changes['currentPoint']?.firstChange
    ) {
    }
  }

  */

  ngOnInit() {
    console.log(this.center, this.currentPoint, this.destiniyPoint);
  }

  mapboxinit() {
    (mapboxgl as any).accessToken =
      'pk.eyJ1Ijoiam9jc3Nhbjk4IiwiYSI6ImNsaW9xNDZ6ZjB2bWIzZnRodTc0aDE4OXEifQ.oL3GaxTxdYoHCgWw80BL_A';

    this.map = new mapboxgl.Map({
      container: 'mapabox', // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [this.destiniyPoint.lng, this.destiniyPoint.lat], // starting position
      zoom: 14, // starting zoom
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      // Add an image to use as a custom marker
      this.map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
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
                    coordinates: [
                      this.destiniyPoint.lng,
                      this.destiniyPoint.lat,
                    ],
                  },
                  properties: {
                    title: 'Mapbox DC',
                  },
                },
                {
                  // feature for Mapbox DC
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [this.currentPoint.lng, this.currentPoint.lat],
                  },
                  properties: {
                    title: 'Mapbox Current Point',
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
    });
  }

  actualizarPuntos(
    newLng1: number,
    newLng2: number,
    newLat1: number,
    newLat2: number
  ) {
    console.log('actualizarPuntos');

    const source = this.map?.getSource('points');
    console.log(source);

    if (source) {
      const puntos = [
        {
          lng: newLng1,
          lat: newLat1,
          title: 'Punto 1',
        },
        {
          lng: newLng2,
          lat: newLng2,
          title: 'Punto 2',
        },
        // Agrega más puntos aquí si es necesario
      ];

      console.log('funcionara esta madre');

      puntos.forEach((punto) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([punto.lng, punto.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<p>${punto.title}</p>`))
          .addTo(this.map);
      });
    }
  }
}
