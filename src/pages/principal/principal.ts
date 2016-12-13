import { Component } from '@angular/core';

import { PaginaMapa } from '../mapa/mapa';
import { PaginaConfiguracion } from '../configuracion/configuracion';
import { PaginaPerfil } from '../perfil/perfil';

@Component({
  templateUrl: 'principal.html'
})
export class PaginaPrincipal {

	tab1Root: any = PaginaMapa;
  	tab2Root: any = PaginaConfiguracion;
  	tab3Root: any = PaginaPerfil;

  	constructor() {
    
  	}

}
