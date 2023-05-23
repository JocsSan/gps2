import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { MapComponent } from './components/map/map.component';
import { IndexComponent } from './components/index/index.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'index',
    component: IndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
