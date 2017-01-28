import { Component } from '@angular/core';

import { PaginaMapa } from '../mapa/mapa';
import { PaginaFavoritos } from '../favoritos/favoritos';
import { PaginaRecorridos } from '../recorridos/recorridos';
import { PaginaPerfil } from '../perfil/perfil';
import { PaginaInicio } from '../inicio/inicio';

import { NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'principal.html'
})

export class PaginaPrincipal {

	paginaMapa: any = PaginaMapa;
  	paginaFavoritos: any = PaginaFavoritos;
  	paginaRecorridos: any = PaginaRecorridos;
  	paginaPerfil: any = PaginaPerfil;
  	paginaInicio: any = PaginaInicio;

  	constructor(private navParams: NavParams) {
    	
  	}

}
