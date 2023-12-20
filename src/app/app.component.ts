import { ApplicationRef, Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { NetworkService } from './services/net-work.service';
import { SwUpdate } from '@angular/service-worker';
import { concat, first, interval } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage$: StorageService,
    private network$: NetworkService,
    public updates: SwUpdate,
    private appRef: ApplicationRef
  ) {
    // Comprueba si los Service Workers están disponibles
    if ('serviceWorker' in navigator && environment.production) {
      // Permite a la aplicación estabilizarse antes de comprobar las actualizaciones
      const appIsStable$ = appRef.isStable.pipe(
        first((isStable) => isStable === true)
      );
      const everySixHours$ = interval(6 * 60 * 60 * 1000);
      const everySixHoursOnceAppIsStable$ = concat(
        appIsStable$,
        everySixHours$
      );

      everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());

      updates.available.subscribe((event) => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);
        updates.activateUpdate().then(() => this.updateApp());
      });

      updates.activated.subscribe((event) => {
        console.log('old version was', event.previous);
        console.log('new version is', event.current);
      });
    }
  }

  updateApp() {
    document.location.reload();
    console.log('The app is updating right now');
  }

  networkStatus!: boolean;

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    this.initstorage();
    this.listenerNetwork();
    this.networkStatus = await this.netWorkStatusInit();
  }

  estadoRed!: boolean;

  listenerNetwork() {
    this.network$.getStatusObservable().subscribe(
      (res) => {
        console.log(res);
        this.networkStatus = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  netWorkStatusInit = async (): Promise<boolean> => {
    const initStatus = await this.network$.getNetWorkStatus();

    return initStatus.connected;
  };

  initstorage() {
    this.storage$.init();
  }
}
