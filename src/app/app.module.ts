import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { PaginaLogin } from '../pages/login/login';
import { PaginaRegistro } from '../pages/registro/registro';
import { PaginaPrincipal } from '../pages/principal/principal';
import { PaginaMapa } from '../pages/mapa/mapa';
import { PaginaFavoritos } from '../pages/favoritos/favoritos';
import { PaginaRecorridos } from '../pages/recorridos/recorridos';
import { PaginaPerfil } from '../pages/perfil/perfil';
import { PaginaNuevoRecorrido } from '../pages/nuevorecorrido/nuevorecorrido';
import { PaginaInicio } from '../pages/inicio/inicio';

import { Storage } from '@ionic/storage';
import { LocationTracker } from '../providers/location-tracker';

@NgModule({
  declarations: [
    MyApp,
    PaginaLogin,
    PaginaRegistro,
    PaginaPrincipal,
    PaginaMapa,
    PaginaFavoritos,
    PaginaRecorridos,
    PaginaPerfil,
    PaginaNuevoRecorrido,
    PaginaInicio
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PaginaLogin,
    PaginaRegistro,
    PaginaPrincipal,
    PaginaMapa,
    PaginaFavoritos,
    PaginaRecorridos,
    PaginaPerfil,
    PaginaNuevoRecorrido,
    PaginaInicio
  ],
  providers: [{
    provide: ErrorHandler, 
    useClass: IonicErrorHandler
  }, Storage, LocationTracker]
})

export class AppModule {

  SERVICIO_WEB: any;
  SERVICIO_RECORRIDOS_POSICIONES: any;
  SERVICIO_RECORRIDOS_EMOCIONES: any;
  SERVICIO_RECORRIDOS: any;
  SERVICIO_PERSONAS: any;

  constructor(storage: Storage) {
    //VARIABLES CON RUTAS
    this.SERVICIO_WEB = 'http://karview.kradac.com:8080/ldutplrest/webresources/';

    this.SERVICIO_RECORRIDOS = this.SERVICIO_WEB + 'ec.edu.utpl.ldutpl.entidades.recorridos/';
    this.SERVICIO_RECORRIDOS_EMOCIONES = this.SERVICIO_WEB + 'ec.edu.utpl.ldutpl.entidades.recorridosemociones/';
    this.SERVICIO_RECORRIDOS_POSICIONES = this.SERVICIO_WEB + 'ec.edu.utpl.ldutpl.entidades.recorridosposiciones/';

    this.SERVICIO_PERSONAS = this.SERVICIO_WEB + 'ec.edu.utpl.ldutpl.entidades.personas/';    

    //DATOS EN MEMORIA
    storage.set('SERVICIO_RECORRIDOS', this.SERVICIO_RECORRIDOS);
    storage.set('SERVICIO_RECORRIDOS_POSICIONES', this.SERVICIO_RECORRIDOS_POSICIONES);
    storage.set('SERVICIO_RECORRIDOS_EMOCIONES', this.SERVICIO_RECORRIDOS_EMOCIONES);
    
    storage.set('SERVICIO_PERSONAS', this.SERVICIO_PERSONAS);
  }
}
