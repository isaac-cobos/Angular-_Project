import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';
@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor( public _usuarioService: UsuarioService, public router: Router) {
    
  }

  canActivate(): Promise<boolean> | boolean {
    console.log('Token Guard');

    let token = this._usuarioService.token;
    //transformamos a json el token y lo transformamos tambien con atob() de cadena de base 64 a string
    let payload = JSON.parse( atob(token.split('.')[1]));

    let expirado = this.expirado( payload.exp);
    
    if( expirado) {
      this.router.navigate(['/login']);
      return false;
    } 
    return this.verificaRenueva(payload.exp);
  }

  /**
   * 
   * @param fechaExp funciona que nos retorna una promesa booleana
   *
   */
  public verificaRenueva(fechaExp: number): Promise<boolean> {
      return new Promise((resolve, reject) => {

        //transformamos la fechaExp a milisegundos
        let tokenExp = new Date( fechaExp * 1000);
        let ahora = new Date();
        ahora.setTime(ahora.getTime() + (1 * 60 * 60 * 1000));

        if( tokenExp.getTime() > ahora.getTime()) {
          resolve(true)
        } else {
          this._usuarioService.renuevaToken()
                .subscribe(() => {
                  resolve(true);
                }, () => {
                  this.router.navigate(['/login']);
                  reject(false);
                });
        }



        resolve(true);
      });
  }

  /**
   * 
   * @param fechaExp Funtion que nos dice si el token ha expirado 
   * lo analizamos por el tiempo de duracion del token
   */
  public expirado( fechaExp: number) {
    //Obtenemos la hora actual del sistema y la transformamos a segundos 
      let ahora = new Date().getTime() / 1000;
      if(fechaExp < ahora) {
        return true;
      } else {
        return false;
      }
  }
}
