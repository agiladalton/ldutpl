import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { PaginaRegistro } from '../registro/registro';
import { PaginaPrincipal } from '../principal/principal';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class PaginaLogin {

    constructor(public navCtrl: NavController) {
      
    }

    registrar() {
    	this.navCtrl.push(PaginaRegistro);
    }

    iniciarSesion() {
    	this.navCtrl.push(PaginaPrincipal);
    }

}
