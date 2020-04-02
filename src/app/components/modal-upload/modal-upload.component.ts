import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: any;
  img: string;

  constructor( public _subirArchivoService: SubirArchivoService, public _modalUploadService: ModalUploadService) {
  }

  ngOnInit() {
  }

  public cerrarModal(){
      this.imagenTemp = null;
      this.imagenSubir = null;
      this._modalUploadService.ocultarModal();
  }

  seleccionImagen(archivo: File) {
    if(!archivo) {
      this.imagenSubir = null;
      return;
    }
     if( archivo.type.indexOf('image') < 0) {
       sweetAlert('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
       this.imagenSubir = null;
       return;
     }
    this.imagenSubir = archivo;
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => {
      return this.imagenTemp = reader.result;
    };
  }

  public subirImagen() {
    this._subirArchivoService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id )
        .then( resp => {
          this._modalUploadService.notificacion.emit(resp);
          this.cerrarModal();
        })
        .catch( err => {
          console.log('Error en la carga...');
          
        })
  }

}
