import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import swal from 'sweetalert';

declare var sweetAlert: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit {


  hospitales: Hospital[] = [];

  constructor(public _hospitalService: HospitalService,
    public _uploadModalService: ModalUploadService) {
   }

  ngOnInit() {
    this.cargarHospitales();
    this._uploadModalService.notificacion.subscribe(() => this.cargarHospitales());
  }

  public cargarHospitales() {
    this._hospitalService.cargarHospitales()
          .subscribe( hospitales => {
            this.hospitales = hospitales;
          });
  }

 public buscarHospital(termino: string) {
    if( termino.length <= 0) {
       this.cargarHospitales();
      return;
 }

   this._hospitalService.buscarHospital(termino)
          .subscribe(hospitales => this.hospitales = hospitales);

  }

  public guardarHospital(hospital: Hospital) {

    this._hospitalService.actualizarHospital(hospital).subscribe();
  }

  public borrarHospital(hospital: Hospital) {

    this._hospitalService.borrarHospital(hospital._id)
          .subscribe(() => this.cargarHospitales());
  }

  public actualizarImagen(hospital: Hospital) {
          this._uploadModalService.mostrarModal('hospitales', hospital._id);
  }

  public crearHospital() {
    sweetAlert({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then((valor: string) => {
        if(!valor || valor.length === 0 ) {
          return;
        }
        this._hospitalService.crearHospital(valor)
              .subscribe( () => {
                this.cargarHospitales();
              });
    });
  }


}
