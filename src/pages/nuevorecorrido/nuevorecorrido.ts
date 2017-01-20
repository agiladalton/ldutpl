import { Component } from '@angular/core';

import { App, ViewController } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';

import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { PaginaMapa } from '../mapa/mapa';
import { PaginaPrincipal } from '../principal/principal';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-nuevorecorrido',
  templateUrl: 'nuevorecorrido.html'
})

export class PaginaNuevoRecorrido {

	idPersona: any;
	idTipoRecorrido: any;
	titulo: any;
	descripcion: any;
	esPublico: any;

	storageLocal: any;
	paginaMapa: any = PaginaMapa;
	SERVICIO_RECORRIDOS: any;

	constructor(
		public viewCtrl: ViewController,
		private alertCtrl: AlertController,
		public toastCtrl: ToastController,
		public appCtrl: App,
		public http: Http,
		storage: Storage
	) {
        this.storageLocal = storage;

        storage.get('SERVICIO_RECORRIDOS').then((val) => {
	       this.SERVICIO_RECORRIDOS = val;
		});

		storage.get('idPersonaLdutpl').then((val) => {
	       this.idPersona = val;
		});
    }

    iniciarRecorrido() {
    	if (this.validar(this.idPersona) && this.validar(this.idTipoRecorrido) && this.validar(this.titulo) &&
  			this.validar(this.descripcion) && this.validar(this.esPublico)) {
  			let link = this.SERVICIO_RECORRIDOS + 'registro';
	        let data = 'idPersona=' + this.idPersona + '&'
	        	+ 'idTipoRecorrido=' + this.idTipoRecorrido + '&'
	        	+ 'titulo=' + this.titulo + '&'
	        	+ 'descripcion=' + this.descripcion + '&'
	        	+ 'esPublico=' + this.esPublico;

	        let headers = new Headers({
				'Content-Type': 'application/x-www-form-urlencoded'
			});

			let options = new RequestOptions({
				headers: headers
			});
	        
	        this.http.post(link, data, options).subscribe(response => {
				let result = JSON.parse(response['_body']);
				this.mensajeInformativoEfecto(result.message);

				this.paginaMapa.prototype.establecerRecorrido(result.data.idRecorrido);
		    	this.viewCtrl.dismiss();
		      	this.appCtrl.getRootNav().push(PaginaPrincipal);
	        }, error => {
	        	this.mensajeAlerta('Problema de conexión.');
	        });
		} else {
  			this.mensajeInformativoEfecto("Por favor, llene todos los campos del formulario.");
  		}
    }

    mensajeInformativoEfecto(mensaje) {
		let toast = this.toastCtrl.create({
			message: mensaje,
			duration: 3000,
			position: 'top'
		});		    

		toast.present();
	}

	mensajeAlerta(mensaje) {
		let alert = this.alertCtrl.create({
		    title: 'Alerta',
		    subTitle: mensaje,
		    buttons: ['Ok']
		});
		alert.present();
	}

	validar(valor) {
  		if (typeof valor !== 'undefined') {
  			return true;
  		}
  		return false;
  	}

}