import { Injectable } from '@angular/core';
import { NetworkService } from './net-work.service';

@Injectable({
  providedIn: 'root',
})
export class PostOfflinerService {
  constructor(private netWorK$: NetworkService) {}

  postPoint = () => {
    const statusRed = this.netWorK$.isConnected();
    console.log(statusRed ? 'si hay señal' : 'no hay red pipipipipi');
    return statusRed;
  };

  finalPoint = () => {
    const statusRed = this.netWorK$.isConnected();
    console.log(statusRed ? 'si hay señal' : 'no hay red pipipipipi');
    return statusRed;
  };

  purgeWorker = () => {
    console.log('a despachar todo lo que tengo en colas');
  };
}
