import { Component, ViewChild } from '@angular/core';

import { App, NavController, ToastController, AlertController, ActionSheetController, Platform } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { Http, Headers, RequestOptions } from '@angular/http';

import { PaginaRecorridoEditar } from '../recorridoeditar/recorridoeditar';

@Component({
  selector: 'page-recorridos',
  templateUrl: 'recorridos.html'
})

export class PaginaRecorridos {

	@ViewChild('noDatos') etiquetaNoDatos;

	public SERVICIO_RECORRIDOS: any;
	public SERVICIO_RECORRIDOS_EMOCIONES: any;
	public ID_PERSONA_LDUTPL: any;

	public listaRecorridos: any;

	constructor(
		public navCtrl: NavController,
		public toastCtrl: ToastController,
		private alertCtrl: AlertController,
		public storage: Storage,
		public http: Http,
		public actionSheetCtrl: ActionSheetController,
		public platform: Platform,
		public appCtrl: App
	) {
		storage.get('SERVICIO_RECORRIDOS').then((val) => {
      		this.SERVICIO_RECORRIDOS = val;

	      	storage.get('ID_PERSONA_LDUTPL').then((val) => {
	        	this.ID_PERSONA_LDUTPL = val;

	        	storage.get('SERVICIO_RECORRIDOS_EMOCIONES').then((val) => {
	       			this.SERVICIO_RECORRIDOS_EMOCIONES = val;

	       			this.cargarRecorridos();
	        	});
	      	});
	  	});
	}

	cargarRecorridos() {
		let link = this.SERVICIO_RECORRIDOS + 'porPersona';
		let data = 'idPersona=' + this.ID_PERSONA_LDUTPL;

		let headers = new Headers({
			'Content-Type': 'application/x-www-form-urlencoded'
		});

		let options = new RequestOptions({
			headers: headers
		});

		this.http.post(link, data, options).subscribe(response => {
			let result = JSON.parse(response['_body']);

			if (result.length) {
				this.etiquetaNoDatos.nativeElement.hidden = true;
				this.listaRecorridos = result;
			} else {
				this.etiquetaNoDatos.nativeElement.hidden = false;
			}
		}, error => {
			console.log(error);
		});
	}

	eliminar(idRecorrido) {
		let link = this.SERVICIO_RECORRIDOS + 'eliminar';
		let data = 'idRecorrido=' + idRecorrido;

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
				this.cargarRecorridos();
			} else {
				this.mensajeAlerta(result.message);
			}
		}, error => {
			this.mensajeAlerta(error);
		});
	}

	refrescar(refresher) {
	    this.cargarRecorridos();

	    setTimeout(() => {
	      	refresher.complete();
	    }, 2000);
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

	opcionesRecorrido(idRecorrido) {
    	let actionSheet = this.actionSheetCtrl.create({
      		title: 'Opciones',
      		buttons: [{
				text: 'Editar',
				icon: !this.platform.is('ios') ? 'create' : null,
				handler: () => {
		            this.appCtrl.getRootNav().push(PaginaRecorridoEditar, {
		            	idRecorrido: idRecorrido
		            });
				}
	        }, {
	          	text: 'Eliminar',
	          	role: 'destructive',
	          	icon: !this.platform.is('ios') ? 'trash' : null,
	          	handler: () => {
	            	this.eliminar(idRecorrido);
	            	this.cargarRecorridos();
	          	}
	        }, {
	          	text: 'Cancelar',
	          	icon: !this.platform.is('ios') ? 'close' : null
			}]
	    });

    	actionSheet.present();
  	}

}
