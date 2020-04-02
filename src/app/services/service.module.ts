import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
   SettingsService ,
   SharedService,
   SidebarService,
   UsuarioService,
   LoginGuardGuard,
   AdminGuard,
   SubirArchivoService,
   HospitalService,
   MedicoService,
   VerificaTokenGuard
} from './service.index';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService ,
    SharedService,
    SidebarService,
    UsuarioService,
    LoginGuardGuard,
    AdminGuard,
    VerificaTokenGuard,
    SubirArchivoService,
    ModalUploadService,
    HospitalService,
    MedicoService
  ],
})
export class ServiceModule { }
