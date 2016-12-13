import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { Geolocation } from 'ionic-native';
import { SocialSharing } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class PaginaMapa {

	@ViewChild('map') mapElement: ElementRef;
	@ViewChild('iniciar') btnIniciar;
	@ViewChild('finalizar') btnFinalizar;
  	map: any;
  	timerId: any;
  	marcadorPosicion: any

  	constructor(public navCtrl: NavController, private alertCtrl: AlertController) {
    	
  	}

  	ngOnInit(){
	    this.loadMap();
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

			this.centrarMapa(latLng);
			this.agregarMarcadorPersona(latLng);
		});
	}

	centrarMapa(latLng) {
		this.map.setCenter(latLng);
	}

	obtenerLatLng(latitud, longitud) {
	    return new google.maps.LatLng(latitud, longitud);
	}

	iniciarRecorrido() {
		this.ubicarMiPosicion();
		this.timerId = setInterval(() => {
			this.ubicarMiPosicion();
		}, 5000);

		this.btnIniciar._elementRef.nativeElement.hidden = true;
		this.btnFinalizar._elementRef.nativeElement.hidden = false;
	}

	finalizarRecorrido() {
		this.btnIniciar._elementRef.nativeElement.hidden = false;
		this.btnFinalizar._elementRef.nativeElement.hidden = true;
	}

	cambiarIntervalo() {
		let alert = this.alertCtrl.create({
	    	title: 'Intervalo',
	    	inputs: [{
		        value: '30',
		        type: 'radio',
		        label: '30 segundos',
		        checked: true
			}, {
		        value: '1',
		        type: 'radio',
		        label: '1 minuto'
			}, {
		        value: '2',
		        type: 'radio',
		        label: '2 minutos'
			}, {
		        value: '3',
		        type: 'radio',
		        label: '3 minutos'
			}, {
		        value: '4',
		        type: 'radio',
		        label: '4 minutos'
			}, {
		        value: '5',
		        type: 'radio',
		        label: '5 minutos'
			}],
		    buttons: [{
		        text: 'Cancelar',
		        role: 'cancel'
			}, {
		        text: 'Guardar',
		        handler: data => {
		        	console.log('Radio data:', data);
		        }
			}]
		});
	  
		alert.present();
	}

	compartirViaEmail() {
		SocialSharing.canShareViaEmail().then(() => {
			console.log("Es posible");
		}).catch(() => {
			console.log("No es posible");
		});
	}

}
