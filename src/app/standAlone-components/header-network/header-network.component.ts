import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NetworkService } from 'src/app/services/net-work.service';

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

  constructor(private network$: NetworkService) {}
  async ngOnInit() {
    this.networkStatus = await this.netWorkinit();
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
        this.networkStatus = res;
      });
  };
}
