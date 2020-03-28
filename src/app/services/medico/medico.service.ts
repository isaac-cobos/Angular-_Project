import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import sweetAlert from 'sweetalert';
import { Medico } from '../../models/medico.model';



@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(public http: HttpClient, public _usuarioService: UsuarioService) { }

  public cargarMedicos() {
    let url = URL_SERVICIOS + '/medico';
    return this.http.get(url)
            .pipe(map( (resp:any)=> {
              this.totalMedicos = resp.total;
              return resp.medicos;
            }));
  }

  public buscarMedicos(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url)
            .pipe(map((resp: any) =>  {
              resp.medicos;
            }));
  }

  public borrarMedico(id: string) {
      let url = URL_SERVICIOS + '/medico/' + id;
      url += '?token=' + this._usuarioService.token;
      return this.http.delete(url)
            .pipe(map(resp => {
              sweetAlert('Médico borrado', ' Médico borrado correctamente', 'success');
              return resp;
            }));
  }

  public guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';

    if(medico._id) {
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put( url, medico)
            .pipe(map((resp: any) => {
              sweetAlert('Médico Actualizado', medico.nombre, 'success');
              return resp.medico;
            }));

    } else {
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, medico)
            .pipe(map( (resp: any)=> {
              sweetAlert('Médico creado', medico.nombre, 'success');
              return resp.medico;
            }));

    }
  }

  public cargarMedico(id: string) {
      let url = URL_SERVICIOS + '/medico/' +id;
      return this.http.get(url)
              .pipe(map( (resp: any) => {
                 return resp.medico;
              }));
  }

}
