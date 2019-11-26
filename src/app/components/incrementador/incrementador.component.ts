import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress', {static: true}) txtProgress: ElementRef;

  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();



  constructor() {
  }

  ngOnInit() {
  }

  siCambia(nouValor: number) {

    // let elemHTML: any = document.getElementsByName('progreso')[0];
    // console.log(this.txtProgress);



    if (nouValor >= 100 ) {
      this.progreso = 100;
    } else if (nouValor <=0) {
      this.progreso = 0;
    } else {
      this.progreso = nouValor;
    }

    // elemHTML.value = this.progreso;
    this.txtProgress.nativeElement.value = this.progreso;

    this.cambioValor.emit(this.progreso);
  }

  cambiarValor(valor: number) {
    this.progreso += valor;
    if (this.progreso > 100) {this.progreso = 100; }
    if (this.progreso < 0) {this.progreso = 0; }

    this.cambioValor.emit(this.progreso);

    this.txtProgress.nativeElement.focus();

    // console.log(this.progreso);
  }



}
