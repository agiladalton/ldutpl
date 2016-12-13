import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { App, ViewController } from 'ionic-angular';
import { PaginaLogin } from '../login/login';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PaginaPerfil {

	constructor (
		public navCtrl: NavController,
		public viewCtrl: ViewController,
		public appCtrl: App
	) {
	    
	}

	cerrarSesion() {
		this.viewCtrl.dismiss();
      	this.appCtrl.getRootNav().push(PaginaLogin);
    }

}
