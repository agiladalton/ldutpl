import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { Geolocation } from 'ionic-native';
import { SocialSharing } from 'ionic-native';

import { Http, Headers, RequestOptions } from '@angular/http';

import { PaginaNuevoRecorrido } from '../nuevorecorrido/nuevorecorrido';

import { Storage } from '@ionic/storage';

declare var google;

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class PaginaMapa {

	@ViewChild('map') mapElement: ElementRef;
	@ViewChild('nuevo') btnNuevo;
	@ViewChild('finalizar') btnFinalizar;
  	map: any;
  	timerId: any;
  	marcadorPosicion: any;
  	intervalo: any;
  	estadoInicioRecorrido: any;
  	SERVICIO_POSICION_RECORRIDO: any;
  	storageLocal: any;
  	idRecorrido: any;
  	idPersona: any;

  	constructor(
  		public navCtrl: NavController, 
  		private alertCtrl: AlertController,
  		public toastCtrl: ToastController,
  		public http: Http,
  		storage: Storage
	) {	
		this.storageLocal = storage;
		this.intervalo = 30;
		this.estadoInicioRecorrido = false;

		storage.get('SERVICIO_POSICION_RECORRIDO').then((val) => {
	       this.SERVICIO_POSICION_RECORRIDO = val;
		});

		storage.get('idPersonaLdutpl').then((val) => {
	       this.idPersona = val;
		});
  	}

  	ngOnInit(){
	    this.loadMap();

	    if (typeof this.idRecorrido !== 'undefined') {
			this.iniciarRecorrido();
		}
	}
	 
	loadMap(){	 
	    let latLng = this.obtenerLatLng(-3.9825639, -79.1943532);
	 
	    let mapOptions = {
			center: latLng,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	    }

	    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
	}

	addInfoWindow(marker, content){ 
	  	let infoWindow = new google.maps.InfoWindow({
	    	content: content
	  	});
	 
	  	google.maps.event.addListener(marker, 'click', () => {
	    	infoWindow.open(this.map, marker);
	  	});
	}

	agregarMarcador(latLng){ 
  		let marker = new google.maps.Marker({
    		map: this.map,
    		animation: google.maps.Animation.DROP,
    		position: latLng
  		});
 
		let content = "<h4>Information!</h4>";

	  	this.addInfoWindow(marker, content);
	}

	agregarMarcadorPersona(latLng){
		if (typeof this.marcadorPosicion === 'undefined') {
			var sizeImagen = new google.maps.Size(32, 32);

	  		this.marcadorPosicion = new google.maps.Marker({
	    		map: this.map,
	    		animation: google.maps.Animation.DROP,
	    		position: latLng,
	    		icon: {
					scaledSize: sizeImagen,
					size: sizeImagen,
					url: 'img/persona.png'
				}
	  		});
	 
			let content = "<center><h4>Dalton Agila</h4></center>"
				+ "<table>"
				+ "<tr><td><b>Correo:</b></td><td>dalton.agila@gmail.com</td></tr>"
				+ "<tr><td><b>Celular:</b></td><td>0991540427</tr>"
				+ "<tr><td><b>Género:</b></td><td>Masculino</tr>"
				+ "<tr><td width='100px'><b>Fecha de Nacimiento:</b></td><td>22 de Agosto de 1992</tr>"
				+ "</table>";

		  	this.addInfoWindow(this.marcadorPosicion, content);
		} else {
			this.marcadorPosicion.setPosition(latLng);
		}
	}

	ubicarMiPosicion() {
		Geolocation.getCurrentPosition().then(pos => {
			let latLng = this.obtenerLatLng(pos.coords.latitude, pos.coords.longitude);
			let altitud = -1, velocidad = -1;

			if (pos.coords.altitude !== null) {
				altitud = pos.coords.altitude;
			}

			if (pos.coords.speed !== null) {
				velocidad = pos.coords.speed;
			}

			this.centrarMapa(latLng);
			this.agregarMarcadorPersona(latLng);

	        let link = this.SERVICIO_POSICION_RECORRIDO + 'registro';
	        let data = 'idRecorrido='+this.idRecorrido+'&'
	        	+ 'idPersona=' + this.idPersona + '&'
	        	+ 'fechaHoraEquipo='+new Date().getTime()+ '&'
	        	+ 'latitud='+pos.coords.latitude+'&'
	        	+ 'longitud='+pos.coords.longitude+'&'
	        	+ 'altitud=' + altitud +'&'
	        	+ 'velocidad=' + velocidad;

	        let headers = new Headers({
				'Content-Type': 'application/x-www-form-urlencoded'
			});

			let options = new RequestOptions({
				headers: headers
			});
	        
	        this.http.post(link, data, options).subscribe(response => {
				let result = JSON.parse(response['_body']);

				this.mensajeInformativoEfecto(result.message);
	        }, error => {
	        	this.mensajeInformativoEfecto('Problema de conexión.');
	        });
		}, (err) => {
			this.finalizarRecorrido();
	      	this.mensajeAlerta(err.message);
	    });
	}

	centrarMapa(latLng) {
		this.map.setCenter(latLng);
	}

	obtenerLatLng(latitud, longitud) {
	    return new google.maps.LatLng(latitud, longitud);
	}

	establecerRecorrido(idRecorrido) {
		this.idRecorrido = idRecorrido;
	}

	iniciarRecorrido() {
		this.ubicarMiPosicion();
		this.timerId = setInterval(() => {
			this.ubicarMiPosicion();
		}, 1000 * this.intervalo);

		this.btnNuevo._elementRef.nativeElement.hidden = true;
		this.btnFinalizar._elementRef.nativeElement.hidden = false;
		this.estadoInicioRecorrido = true;
	}

	finalizarRecorrido() {
		clearTimeout(this.timerId);		
		this.btnNuevo._elementRef.nativeElement.hidden = false;
		this.btnFinalizar._elementRef.nativeElement.hidden = true;
		this.estadoInicioRecorrido = false;
	}

	cambiarIntervalo() {
		let estado5seg = false, estado10seg = false, estado20seg = false, estado30seg = false;
		let estado60seg = false, estado120seg = false, estado180seg = false, estado240seg = false, estado300seg = false;

		switch(this.intervalo) {
			case 5:
				estado5seg = true;
				break;
			case 10:
				estado10seg = true;
				break;				
			case 20:
				estado20seg = true;
				break;
			case 30:
				estado30seg = true;
				break;
			case 60:
				estado60seg = true;
				break;
			case 120:
				estado120seg = true;
				break;
			case 120:
				estado180seg = true;
				break;
			case 240:
				estado240seg = true;
				break;
			case 300:
				estado300seg = true;
				break;
			default: 
				estado30seg = true;
		}

		let alert = this.alertCtrl.create({
	    	title: 'Intervalo',
	    	inputs: [{
		        value: '5',
		        type: 'radio',
		        label: '5 segundos',
		        checked: estado5seg
			}, {
		        value: '10',
		        type: 'radio',
		        label: '10 segundos',
		        checked: estado10seg
			}, {
		        value: '20',
		        type: 'radio',
		        label: '20 segundos',
		        checked: estado20seg
			}, {
		        value: '30',
		        type: 'radio',
		        label: '30 segundos',
		        checked: estado30seg
			}, {
		        value: '60',
		        type: 'radio',
		        label: '1 minuto',
		        checked: estado60seg
			}, {
		        value: '120',
		        type: 'radio',
		        label: '2 minutos',
		        checked: estado120seg
			}, {
		        value: '180',
		        type: 'radio',
		        label: '3 minutos',
		        checked: estado180seg
			}, {
		        value: '240',
		        type: 'radio',
		        label: '4 minutos',
		        checked: estado240seg
			}, {
		        value: '300',
		        type: 'radio',
		        label: '5 minutos',
		        checked: estado300seg
			}],
		    buttons: [{
		        text: 'Cancelar',
		        role: 'cancel'
			}, {
		        text: 'Guardar',
		        handler: data => {
		        	this.intervalo = parseInt(data);
		        	if (this.estadoInicioRecorrido) {
		        		this.finalizarRecorrido();
		        		//this.iniciarRecorrido();
		        	}
		        }
			}]
		});
	  
		alert.present();
	}

	nuevoRecorrido() {
		this.navCtrl.push(PaginaNuevoRecorrido);
	}

	compartirViaEmail() {
		SocialSharing.canShareViaEmail().then(() => {
			this.mensajeInformativoEfecto('Es posible');
		}).catch(() => {
			this.mensajeInformativoEfecto('NO es posible');
		});
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
