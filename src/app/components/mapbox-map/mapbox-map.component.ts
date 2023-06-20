import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-mapbox-map',
  templateUrl: './mapbox-map.component.html',
  styleUrls: ['./mapbox-map.component.scss'],
})
export class MapboxMapComponent implements OnInit, AfterViewInit {
  map: any;
  geojson: any;

  lat: any;
  lng: any;

  coordenadas!: { lng: number; lat: number };

  constructor() {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.coordenadas = { lat: 15.467518, lng: -87.960144 };
    setTimeout(() => this.mapboxinit(), 500);
    /*
    this.geolocation
      .getCurrentPosition()
      .then((position: GeolocationPosition) => {
        // Aquí puedes acceder a las coordenadas de latitud y longitud
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log('desde el mapa', latitude, longitude);
      })
      .catch((error) => {
        console.log('Error al obtener la ubicación', error);
      });


    const options: GeolocationOptions = {
      enableHighAccuracy: true, // Opcional: habilita la máxima precisión posible
    };

    const watch = this.geolocation.watchPosition(options).subscribe(
      (position: any) => {
        // Aquí puedes acceder a las coordenadas de latitud y longitud en tiempo real
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(
          'desde el mapa',
          this.coordenadas.lat,
          this.coordenadas.lng
        );
      },
      (error) => {
        console.log('Error al obtener la ubicación desde mapa', error);
      }
    );*/

    // Para detener el seguimiento, puedes llamar a watch.unsubscribe()
  }

  mapboxinit() {
    (mapboxgl as any).accessToken =
      'pk.eyJ1Ijoiam9jc3Nhbjk4IiwiYSI6ImNsaW9xNDZ6ZjB2bWIzZnRodTc0aDE4OXEifQ.oL3GaxTxdYoHCgWw80BL_A';

    this.map = new mapboxgl.Map({
      container: 'mapabox', // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [this.coordenadas.lng, this.coordenadas.lat], // starting position
      zoom: 9, // starting zoom
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
                    coordinates: [this.coordenadas.lng, this.coordenadas.lat],
                  },
                  properties: {
                    title: 'Mapbox DC',
                  },
                },
                {
                  // feature for Mapbox SF
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [this.coordenadas.lng, this.coordenadas.lat],
                  },
                  properties: {
                    title: 'Mapbox SF',
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
}
