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
import { Storage } from '@ionic/storage';

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
    PaginaNuevoRecorrido
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
    PaginaNuevoRecorrido
  ],
  providers: [{
    provide: ErrorHandler, 
    useClass: IonicErrorHandler
  }, Storage]
})

export class AppModule {

  SERVICIO_WEB: any;
  SERVICIO_POSICION_RECORRIDO: any;
  SERVICIO_PERSONAS: any;

  constructor(storage: Storage) {
    this.SERVICIO_WEB = 'http://192.168.0.102:8080/ldutplrest/webresources/';
    this.SERVICIO_POSICION_RECORRIDO = this.SERVICIO_WEB + 'ec.edu.utpl.ldutpl.entidades.posicionesrecorridos/';
    this.SERVICIO_PERSONAS = this.SERVICIO_WEB + 'ec.edu.utpl.ldutpl.entidades.personas/';

    storage.set('SERVICIO_POSICION_RECORRIDO', this.SERVICIO_POSICION_RECORRIDO);
    storage.set('SERVICIO_PERSONAS', this.SERVICIO_PERSONAS);
  }
}
