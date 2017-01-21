import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { PaginaRegistro } from '../registro/registro';
import { PaginaPrincipal } from '../principal/principal';

import { Http, Headers, RequestOptions } from '@angular/http';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class PaginaLogin {

    usuario: any;
    clave: any;
    SERVICIO_PERSONAS: any;
    storageLocal: any;

    constructor(
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        private alertCtrl: AlertController,
        public http: Http,
        storage: Storage
    ) {
        this.storageLocal = storage;
        storage.get('SERVICIO_PERSONAS').then((val) => {
           this.SERVICIO_PERSONAS = val;
        });
    }

    registrar() {
    	this.navCtrl.push(PaginaRegistro);
    }

    iniciarSesion() {
        if (this.validar(this.usuario) && this.validar(this.clave)) {
            let link = this.SERVICIO_PERSONAS + 'login';
            let data = 'usuario=' + this.usuario + '&'
                + 'clave=' + this.clave;

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
                        this.storageLocal.set('idPersonaLdutpl', result.data.idPersona);
                        this.navCtrl.push(PaginaPrincipal);
                        this.mensajeInformativoEfecto(result.message);
                    } else {
                        this.mensajeAlerta(result.message);
                    }
                } else {
                    this.mensajeAlerta('Problema en la transacción.');
                }
            }, error => {
                this.mensajeAlerta(error);
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
