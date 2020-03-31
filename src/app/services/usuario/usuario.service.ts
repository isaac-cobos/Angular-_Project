import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import sweetAlert from 'sweetalert';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(public http: HttpClient, public router: Router, public _subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  public estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  public logOut() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  public cargarStorage() {
    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));

    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [null];
    }
  }

  /**
   *
   * @param id
   * @param token
   * @param usuario
   */
  public guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  /**
   *
   * @param token
   */
  public loginGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, {token})
            .pipe(map((resp: any) => {
              console.log(resp);
              this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
              return true;
            }));
    }

  /**
   * @param usuario
   * @param recordar
   */
  public login(usuario: Usuario, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
    .pipe(map((resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    }))
    .pipe(catchError( (err: any) => {
      sweetAlert('Error en el login', err.error.mensaje, 'error');
      return throwError(err);
    }));

  }

  /**
   *
   * @param usuario
   */
  public crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
    .pipe(map( (resp: any) => {
      console.log(resp.usuario);
      sweetAlert('Usuario creado', usuario.email, 'success');
      return resp.usuario;
    }))
    .pipe(catchError( (err: any) => {
      sweetAlert(err.error.mensaje, err.error.errors.message, 'error');
      return throwError(err);
    }));
  }

  public actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario)
            .pipe(map((resp: any) => {

              if ( usuario._id === this.usuario._id) {
                const usuarioDB: Usuario = resp.usuarios;
                this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
              }
                sweetAlert('Usuario actualizado', usuario.nombre, 'success');
                return true;
            }))
            .pipe(catchError( (err: any) => {
              sweetAlert(err.error.mensaje, err.error.errors.message, 'error');
              return throwError(err);
            }));

  }

  public cambiarImagen(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
      .then( (resp: any) => {
        this.usuario.img = resp.usuario.img;
        sweetAlert('Imagen actualizada', this.usuario.nombre, 'success');
        this.guardarStorage(id, this.token, this.usuario, this.menu );
      })
      .catch(resp => {
        console.log(resp);
      });
  }

  public cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  public buscarUsuarios(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url)
            .pipe(map((resp: any) =>  {
              resp.usuarios;
            }));
  }

  public borrarUsuario(id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;
    return this.http.delete(url)
            .pipe(map(resp => {
              sweetAlert('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
              return true;
            }));
  }
}
