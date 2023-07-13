import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { NetworkService } from './services/net-work.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage$: StorageService,
    private networkService: NetworkService
  ) {}

  networkStatus: any;
  networkListener!: PluginListenerHandle;

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    this.initstorage();
    this.listenerNetwork();
  }

  estadoRed!: boolean;

  listenerNetwork() {
    this.networkService.startNetworkListener();
    console.log('Initial network status:', this.networkService.isConnected());
    this.estadoRed = this.networkService.isConnected();
  }

  initstorage() {
    this.storage$.init();
  }
}
