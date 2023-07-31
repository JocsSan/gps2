import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GeotService } from 'src/app/services/geot.service';
import { NetworkService } from 'src/app/services/net-work.service';
import { PostOfflinerService } from 'src/app/services/post-offliner.service';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  selector: 'app-header-network',
  templateUrl: './header-network.component.html',
  styleUrls: ['./header-network.component.scss'],
})
export class HeaderNetworkComponent implements OnInit, OnDestroy {
  @Input() orientation!: 'start' | 'end';

  public subscripciones: { [key: string]: Subscription } = {};

  networkStatus!: boolean;

  constructor(
    private network$: NetworkService,
    private postOffline$: PostOfflinerService
  ) {}
  async ngOnInit() {
    this.networkStatus = await this.netWorkinit();
    this.listenerNetwork();
  }

  ngOnDestroy(): void {
    Object.keys(this.subscripciones).forEach((key) => {
      try {
        this.subscripciones[key].unsubscribe();
        console.log('key', key);
      } catch (error) {
        console.log(error);
      }
    });
  }

  netWorkinit = async (): Promise<boolean> => {
    const currentNetwork = await this.network$.getNetWorkStatus();
    return currentNetwork.connected;
  };

  listenerNetwork = (): void => {
    this.subscripciones['getStatusObservable'] = this.network$
      .getStatusObservable()
      .subscribe((res) => {
        console.log(res);
        this.networkStatus = res;
        if (this.networkStatus) {
          this.postOffline$.postListado();
        }
      });
  };
}
