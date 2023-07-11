import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private storage: Storage, private storage$: StorageService) {}

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    this.initstorage();
  }

  initstorage() {
    this.storage$.init();
  }
}
