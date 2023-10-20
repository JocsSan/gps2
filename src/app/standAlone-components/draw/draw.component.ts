import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import SignaturePad from 'signature_pad';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements OnInit {
  @Output() signature = new EventEmitter<string>();

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

  isEmpty = (): boolean => {
    return this.sig.isEmpty();
  };
  saveSignature() {
    // console.log(this.sig.toDataURL());
    this.signature.emit(this.sig.toDataURL());
    return this.sig.toDataURL();
  }
}
