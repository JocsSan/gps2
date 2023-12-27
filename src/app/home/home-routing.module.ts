import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { MapComponent } from './components/map/map.component';
import { IndexComponent } from './components/index/index.component';
import { JwtGuard } from '../utils/guards/jwt.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'map',
    component: MapComponent,
    canActivate: [JwtGuard],
  },
  {
    path: 'index',
    component: IndexComponent,
    canActivate: [JwtGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
