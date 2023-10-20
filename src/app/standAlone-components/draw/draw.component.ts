import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-draw',
  standalone: true,
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class DrawComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  sig!: SignaturePad;

  constructor() {}

  ngOnInit() {
    this.sig = new SignaturePad(this.canvas.nativeElement);
  }

  @HostListener('window:keydown.enter', ['$event'])
  clear() {
    this.sig.clear();
  }
}
