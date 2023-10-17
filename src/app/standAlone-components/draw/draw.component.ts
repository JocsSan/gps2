import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-draw',
  standalone: true,
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class DrawComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasRef', { static: false }) canvasRef!: ElementRef;

  public width: number = 500;
  public height: number = 450;

  private cx!: CanvasRenderingContext2D;

  private points: Array<any> = [];

  public isAvailabe: boolean = false;

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:mousemove', ['$event'])
  onMove = (event: any) => {
    if (
      this.isMobileDevice() ||
      (event.target && event.target.id === 'canvasId')
    ) {
      event.preventDefault(); // Evita el comportamiento predeterminado del desplazamiento en dispositivos táctiles
      this.write(event);
    }
  };

  @HostListener('document:click', ['$event'])
  onClick = (event: any) => {
    if (event.target && event.target.id === 'canvasId') {
      this.isAvailabe = !this.isAvailabe;
    }
  };

  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  constructor() {}

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.render();
  }
  private render() {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
  }
  private write(res: any) {
    const canvasEl = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top,
    };
    this.writeSingle(prevPos);
  }

  private writeSingle(prevPos: any, emit: boolean = true) {
    this.points.push(prevPos);
    if (this.points.length > 3) {
      const prevPost = this.points[this.points.length - 1];
      const currentPost = this.points[this.points.length - 2];

      this.drawOnCanvas(prevPost, currentPost);
      if (emit) {
        //this.socketWebService.emitEvent({ prevPost })
      }
    }
  }
  private drawOnCanvas(prevPos: any, currentPost: any) {
    if (!this.cx) return;
    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPost.x, currentPost.y);
      this.cx.stroke();
    }
  }
  public clearZone = () => {
    this.points = [];
    this.cx.clearRect(0, 0, this.width, this.height);
  };
}
