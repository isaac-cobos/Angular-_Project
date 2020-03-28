import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import swal from 'sweetalert';


declare var sweetAlert: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];

  constructor(public _medicoService: MedicoService) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  public borrarMedico(medico: Medico) {
    this._medicoService.borrarMedico(medico._id)
          .subscribe(() => this.cargarMedicos());

  }

  public cargarMedicos() {
    this._medicoService.cargarMedicos()
          .subscribe(medicos => {
            this.medicos = medicos;
          });
  }


  public buscarMedico(termino: string) {

    if( termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

/*     this._medicoService.buscarMedicos(termino)
            .subscribe( medicos => this.medicos = medicos); */
  }

  public crearMedico() {
    sweetAlert({
      title: 'Añadir médico',
      text: 'Ingrese el nombre del médico',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then((valor: string) => {
        if(!valor || valor.length === 0 ) {
          return;
        }
        this._medicoService.cargarMedicos()
              .subscribe( () => {
                this.cargarMedicos();
              });
    });

  }

}
