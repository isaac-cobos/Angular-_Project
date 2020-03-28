import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/internal/operators/map';
import { UsuarioService } from '../usuario/usuario.service';
import { Hospital } from '../../models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

totalHospitales: number;

  constructor(public http: HttpClient, public _usuarioService: UsuarioService) {
  }

  public cargarHospitales() {
    let url = URL_SERVICIOS + '/hospital';
    return this.http.get(url)
            .pipe(map( (resp: any) => {
              this.totalHospitales = resp.total;
              return resp.hospitales;
            })
          )}

  public obtenerHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => {
        return resp.hospital;
        })
      )}

  public borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
          .pipe(map( resp => {
            sweetAlert('Hospital borrado', ' Eliminado correctamente', 'success');
          }));
  }

  public crearHospital(nombre: string) {
    let url = URL_SERVICIOS + '/hospital/';
    url += '?token=' +  this._usuarioService.token;
    return this.http.post(url, {nombre})
          .pipe(map((resp: any) => resp.hospital));
  }

  public buscarHospital(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url)
            .pipe(map((resp: any) =>  {
              return resp.hospital;
            }));
  }

  public actualizarHospital(hospital: Hospital) {
      let url = URL_SERVICIOS + '/hospital/' + hospital._id;
      url+= '?token=' + this._usuarioService.token;
      return this.http.put(url, hospital)
          .pipe(map((resp: any) => {
            sweetAlert('Hospital actualizado', hospital.nombre, 'success');
              return resp.hospital;
         })
      )}
}
