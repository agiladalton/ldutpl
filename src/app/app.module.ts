import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { PaginaLogin } from '../pages/login/login';
import { PaginaRegistro } from '../pages/registro/registro';
import { PaginaPrincipal } from '../pages/principal/principal';
import { PaginaMapa } from '../pages/mapa/mapa';
import { PaginaConfiguracion } from '../pages/configuracion/configuracion';
import { PaginaPerfil } from '../pages/perfil/perfil';

@NgModule({
  declarations: [
    MyApp,
    PaginaLogin,
    PaginaRegistro,
    PaginaPrincipal,
    PaginaMapa,
    PaginaConfiguracion,
    PaginaPerfil
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
    PaginaConfiguracion,
    PaginaPerfil
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
