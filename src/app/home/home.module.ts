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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ButtonModule,
    GoogleMapsModule,
  ],
  declarations: [HomePage, MapComponent, IndexComponent, MapboxMapComponent],
})
export class HomePageModule {}
