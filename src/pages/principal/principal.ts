import { Component } from '@angular/core';

import { PaginaMapa } from '../mapa/mapa';
import { PaginaFavoritos } from '../favoritos/favoritos';
import { PaginaRecorridos } from '../recorridos/recorridos';
import { PaginaPerfil } from '../perfil/perfil';

@Component({
  templateUrl: 'principal.html'
})
export class PaginaPrincipal {

	tab1Root: any = PaginaMapa;
  	tab2Root: any = PaginaFavoritos;
  	tab3Root: any = PaginaRecorridos;
  	tab4Root: any = PaginaPerfil;

  	constructor() {
    
  	}

}
