import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { Geolocation } from 'ionic-native';

import { Http, Headers, RequestOptions } from '@angular/http';

import { PaginaPrincipal } from '../principal/principal';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html'
})
export class PaginaRegistro {

	cedula: any;
	nombres: any;
	apellidos: any;
	genero: any;
	fechaNacimiento: any;
	correo: any;
	celular: any;
	clave: any;
	SERVICIO_PERSONAS: any;

  	constructor(
  		public navCtrl: NavController,
  		public toastCtrl: ToastController,
  		private alertCtrl: AlertController,
  		public http: Http,
  		storage: Storage
	) {
        this.fechaNacimiento = new Date(new Date().getTime() - new Date('1970-01-01 00:00:00').getTime()).toISOString();
        this.genero = 1;

        storage.get('SERVICIO_PERSONAS').then((val) => {
           this.SERVICIO_PERSONAS = val;
        })
  	}

  	registrar() {
  		Geolocation.getCurrentPosition().then(pos => {
  			let altitud = -1;
  			if (pos.coords.altitude !== null) {
				altitud = pos.coords.altitude;
			}

  			this.enviarDatosRegistro(pos.coords.latitude, pos.coords.longitude, altitud);
		}, (err) => {
	      	this.enviarDatosRegistro(0, 0, 0);
	    });
  	}

  	enviarDatosRegistro(latitud, longitud, altitud) {
  		if (this.validar(this.cedula) && this.validar(this.nombres) && this.validar(this.apellidos) &&
  			this.validar(this.genero) && this.validar(this.fechaNacimiento) && this.validar(this.correo) &&
  			this.validar(this.celular) && this.validar(this.clave)) {
		  		let link = this.SERVICIO_PERSONAS + 'registro';
		  		let data = 'cedula=' + this.cedula + '&'
			  		+ 'nombres=' + this.nombres + '&'
			  		+ 'apellidos=' + this.apellidos + '&'
			  		+ 'genero=' + this.genero + '&'
			  		+ 'fechaNacimiento=' + new Date(this.fechaNacimiento).getTime() + '&'
			  		+ 'correo=' + this.correo + '&'
			  		+ 'celular=' + this.celular + '&'
			  		+ 'clave=' + this.clave + '&'
			  		+ 'latitud=' + latitud + '&'
			  		+ 'longitud=' + longitud + '&'
			  		+ 'altitud=' + altitud;

		  		let headers = new Headers({
		  			'Content-Type': 'application/x-www-form-urlencoded'
		  		});

		  		let options = new RequestOptions({
		  			headers: headers
		  		});

		  		this.http.post(link, data, options).subscribe(response => {
		  			let result = JSON.parse(response['_body']);

		  			if (typeof result.success !== 'undefined') {
		  				if (result.success) {
		  					this.navCtrl.push(PaginaPrincipal);
		  					this.mensajeInformativoEfecto(result.message);
		  				} else {
		  					this.mensajeAlerta(result.message);
		  				}
		  			} else {
		  				this.mensajeAlerta('Problema en la transacción.');
		  			}
		  		}, error => {
		  			this.mensajeAlerta('Problema de conexión.');
		  		});
  		} else {
  			this.mensajeInformativoEfecto("Por favor, llene todos los campos del formulario.");
  		}
  	}

  	validar(valor) {
  		if (typeof valor !== 'undefined') {
  			return true;
  		}
  		return false;
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

}
