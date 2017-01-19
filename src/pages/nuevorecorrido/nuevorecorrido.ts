import { Component } from '@angular/core';

import { App, ViewController } from 'ionic-angular';

import { PaginaPrincipal } from '../principal/principal';


@Component({
  selector: 'page-nuevorecorrido',
  templateUrl: 'nuevorecorrido.html'
})

export class PaginaNuevoRecorrido {

	constructor(
		public viewCtrl: ViewController,
		public appCtrl: App
	) {
        
    }

    iniciarRecorrido() {
    	this.viewCtrl.dismiss();
      	this.appCtrl.getRootNav().push(PaginaPrincipal);
    }

}