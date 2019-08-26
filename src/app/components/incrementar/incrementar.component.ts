import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementar',
  templateUrl: './incrementar.component.html',
  styleUrls: ['./incrementar.component.css']
})
export class IncrementarComponent implements OnInit {

  @Input('nombre') leyenda: String = 'Leyenda';
  @Input() progreso: number = 50;

  @ViewChild('txtProgress') txtProgress: ElementRef;

  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onChanges( newValue: number ) {

    //let elemHtml: any = document.getElementsByName('progreso')[0];

    if (  newValue >= 100 ) {
      this.progreso = 100;
    } else if (newValue <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }
    //elemHtml.value = this.progreso;
    
    this.txtProgress.nativeElement.value = this.progreso;

    this.cambioValor.emit(this.progreso);
  }

  cambiarValor( valor: number ) {

    if (this.progreso >= 100 && valor > 0) {
      this.progreso = 100;
      return;
    }
    if (this.progreso <= 0 && valor < 0) {
      this.progreso = 0;
      return;
    }
    this.progreso = this.progreso + valor;

    this.cambioValor.emit(this.progreso);
    this.txtProgress.nativeElement.focus();
  }

}
