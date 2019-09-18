import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { SettingsService } from '../../services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor( public _ajustes: SettingsService ) { }

  ngOnInit() {
    this.colocarCheck();
  }

  cambiarColor(tema: string, link: any) {
    
    //con esta linea de código lo que hacemos es referenciar o pasar el parámetro
    //link al método aplicarCheck para que lo pueda usar.
    this.aplicarCheck( link );
  
    this._ajustes.aplicarTema( tema );
  }

  aplicarCheck( link: any ) {
    
    //recorremos el documento html de la clase selector
    //y lo metemos en un arrary de selectores
    let selectores : any = document.getElementsByClassName('selector');
    
    //hacemos un for of para el array para removerle la clase working despues
    for ( let ref of selectores ) {
      //removemos la clase working
     ref.classList.remove('working');
    }
    //le añadimos a link la clase working
    link.classList.add('working');
  }

    colocarCheck() {
      let selectores : any = document.getElementsByClassName('selector');

      let tema = this._ajustes.ajustes.tema;

      for ( let ref of selectores ) {
        if ( ref.getAttribute('data-theme') === tema ) {
          ref.classList.add('working');
          break;
        }
      }
    }


}
