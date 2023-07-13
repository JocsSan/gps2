import { Injectable } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Network, NetworkStatus } from '@capacitor/network';
import { PostOfflinerService } from './post-offliner.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private networkListener!: PluginListenerHandle;
  public networkStatus: boolean = false;

  private statusSubject = new Subject<boolean>();

  constructor() {}

  public startNetworkListener(): void {
    this.networkListener = Network.addListener(
      'networkStatusChange',
      (status) => {
        this.networkStatus = status.connected;
        this.statusSubject.next(this.networkStatus);
        console.log('Network status changed:', this.networkStatus);
      }
    );
  }

  public stopNetworkListener(): void {
    if (this.networkListener) {
      this.networkListener.remove();
    }
  }

  public isConnected(): boolean {
    return this.networkStatus;
  }
  getStatusObservable(): Observable<boolean> {
    this.startNetworkListener();

    return this.statusSubject.asObservable();
  }
}
