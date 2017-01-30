import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController, ViewController, ToastController, AlertController, NavParams } from 'ionic-angular';

import { Geolocation, SocialSharing } from 'ionic-native';

import { Http, Headers, RequestOptions } from '@angular/http';

import { PaginaPrincipal } from '../principal/principal';

import { Storage } from '@ionic/storage';

import { LocationTracker } from '../../providers/location-tracker';

declare var google;

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class PaginaMapa {

	@ViewChild('map') mapElement: ElementRef;
	@ViewChild('continuar') bntContinuar;
	@ViewChild('detener') bntDetener;
	@ViewChild('finalizar') btnFinalizar;
  	map: any;
  	timerId: any;
  	marcadorPosicion: any;
  	intervalo: number = 30;
  	seguirPuntero: boolean = true;
  	estadoPrimeraPosicion: boolean = true;
  	estadoInicioRecorrido: boolean = false;
  	SERVICIO_RECORRIDOS_POSICIONES: any;
  	idRecorrido: any;
  	ID_PERSONA_LDUTPL: any;

  	constructor(
  		public navCtrl: NavController, 
  		public viewCtrl: ViewController,
  		private alertCtrl: AlertController,
  		public toastCtrl: ToastController,
  		public http: Http,
  		public storage: Storage,
  		public locationTracker: LocationTracker,
  		public navParams: NavParams
	) {
		storage.get('SERVICIO_RECORRIDOS_POSICIONES').then((val) => {
	       	this.SERVICIO_RECORRIDOS_POSICIONES = val;

	       	storage.get('ID_PERSONA_LDUTPL').then((val) => {
		       this.ID_PERSONA_LDUTPL = val;
			});
		});
  	}

  	ngOnInit(){
  		this.start();
	    this.loadMap();
	    this.establecerRecorrido(this.navParams.get('idRecorrido'));
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
		let latitud = this.locationTracker.lat;
		let longitud = this.locationTracker.lng;

		let latLng = this.obtenerLatLng(latitud, longitud);
		let altitud = -1, velocidad = -1;

		/*if (pos.coords.altitude !== null) {
			altitud = pos.coords.altitude;
		}

		if (pos.coords.speed !== null) {
			velocidad = pos.coords.speed;
		}*/

		if (this.seguirPuntero) {
			this.centrarMapa(latLng);
		}

		this.agregarMarcadorPersona(latLng);

        let link = this.SERVICIO_RECORRIDOS_POSICIONES + 'registro';
        let data = 'idRecorrido='+this.idRecorrido+'&'
        	+ 'idPersona=' + this.ID_PERSONA_LDUTPL + '&'
        	+ 'fechaHoraEquipo='+new Date().getTime()+ '&'
        	+ 'latitud='+latitud+'&'
        	+ 'longitud='+longitud+'&'
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
	}

	centrarMapa(latLng) {
		this.map.setCenter(latLng);
	}

	obtenerLatLng(latitud, longitud) {
	    return new google.maps.LatLng(latitud, longitud);
	}

	establecerRecorrido(idRecorrido) {
		this.idRecorrido = idRecorrido;

		this.iniciarRecorrido();
	}

	iniciarRecorrido() {
		this.ubicarMiPosicion();
		this.timerId = setInterval(() => {
			this.ubicarMiPosicion();
		}, 1000 * this.intervalo);
		
		this.estadoInicioRecorrido = true;
	}

	detenerRecorrido() {
		this.stop();
		clearTimeout(this.timerId);		

		this.bntDetener._elementRef.nativeElement.hidden = true;
		this.bntContinuar._elementRef.nativeElement.hidden = false;
		this.estadoInicioRecorrido = false;
	}

	continuarRecorrido() {
		this.iniciarRecorrido();

		this.bntDetener._elementRef.nativeElement.hidden = false;
		this.bntContinuar._elementRef.nativeElement.hidden = true;
	}

	finalizarRecorrido() {
		this.stop();
		clearTimeout(this.timerId);

		this.navCtrl.push(PaginaPrincipal);
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
		        		this.stop();
						clearTimeout(this.timerId);

						this.iniciarRecorrido();
		        	}
		        }
			}]
		});
	  
		alert.present();
	}

	seguirPunteroMapa() {
		let estadoFalse = false, estadoTrue = false;

		if (this.seguirPuntero) {
			estadoTrue = true;
		} else {
			estadoFalse = true;
		}

		let alert = this.alertCtrl.create({
	    	title: '¿Desea seguir el puntero?',
	    	inputs: [{
		        value: 'false',
		        type: 'radio',
		        label: 'No',
		        checked: estadoFalse
			}, {
		        value: 'true',
		        type: 'radio',
		        label: 'Si',
		        checked: estadoTrue
			}],
		    buttons: [{
		        text: 'Cancelar',
		        role: 'cancel'
			}, {
		        text: 'Guardar',
		        handler: data => {
		        	this.seguirPuntero = data === 'true';
		        }
			}]
		});
	  
		alert.present();
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

	start() {
        this.locationTracker.startTracking();
    }
     
    stop() {
        this.locationTracker.stopTracking();
    }

}
