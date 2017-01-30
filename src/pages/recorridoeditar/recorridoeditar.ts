import { Component } from '@angular/core';

import { App, NavController, ViewController, AlertController, ToastController, NavParams } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';

import { PaginaPrincipal } from '../principal/principal';

import { SingletonService } from '../servicios/singleton';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-recorridoeditar',
  templateUrl: 'recorridoeditar.html'
})

export class PaginaRecorridoEditar {

	idTipoRecorrido: any;
	titulo: any;
	descripcion: any;
	esPublico: any;

	SERVICIO_RECORRIDOS: any;

	constructor(
		public navCtrl: NavController, 
		public viewCtrl: ViewController,
		private alertCtrl: AlertController,
		public toastCtrl: ToastController,
		public appCtrl: App,
		public http: Http,
		public storage: Storage,
		public navParams: NavParams,
		public singleton: SingletonService
	) {
        storage.get('SERVICIO_RECORRIDOS').then((val) => {
	       	this.SERVICIO_RECORRIDOS = val;

	       	this.cargar();
		});
    }

    cargar() {
		let link = this.SERVICIO_RECORRIDOS + 'porRecorrido';
        let data = 'idRecorrido=' + this.navParams.get('idRecorrido');

        let headers = new Headers({
			'Content-Type': 'application/x-www-form-urlencoded'
		});

		let options = new RequestOptions({
			headers: headers
		});
        
        this.http.post(link, data, options).subscribe(response => {
			let result = JSON.parse(response['_body']);

			this.idTipoRecorrido = result.idRecorridoTipo.idRecorridoTipo;
			this.titulo = result.titulo;
			this.descripcion = result.descripcion;
			this.esPublico = result.esPublico;
        }, error => {
        	this.mensajeAlerta(error);
        });
    }

    guardar() {
    	if (this.validar(this.idTipoRecorrido) && this.validar(this.titulo) &&
  			this.validar(this.descripcion) && this.validar(this.esPublico)) {
  			let link = this.SERVICIO_RECORRIDOS + 'editar';
	        let data = 'idRecorrido=' + this.navParams.get('idRecorrido') + '&'
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

				if (result.success) {
					this.mensajeInformativoEfecto(result.message);
			    	
			      	this.navCtrl.push(PaginaPrincipal);
				} else {
					this.mensajeAlerta(result.message);	
				}
	        }, error => {
	        	this.mensajeAlerta(error);
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