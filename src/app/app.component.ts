import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { NetworkService } from './services/net-work.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage$: StorageService,
    private network$: NetworkService
  ) {}

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
