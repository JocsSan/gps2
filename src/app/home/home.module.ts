import { GoogleMapsModule } from '@angular/google-maps';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ButtonModule } from 'primeng/button';

import { HomePageRoutingModule } from './home-routing.module';
import { MapComponent } from './components/map/map.component';
import { IndexComponent } from './components/index/index.component';
import { MapboxMapComponent } from '../components/mapbox-map/mapbox-map.component';
import { CalcularDistanciaPipe } from '../pipes/calculo-distancia.pipe';
import { HeaderNetworkComponent } from '../standAlone-components/header-network/header-network.component';
import { DrawComponent } from '../standAlone-components/draw/draw.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ButtonModule,
    GoogleMapsModule,
    HeaderNetworkComponent,
    DrawComponent,
  ],
  declarations: [
    HomePage,
    MapComponent,
    IndexComponent,
    MapboxMapComponent,
    CalcularDistanciaPipe,
  ],
})
export class HomePageModule {}
