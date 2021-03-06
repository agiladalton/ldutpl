import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation } from 'ionic-native';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocationTracker provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationTracker {
	public watch: any;    
  	public lat: number = 0;
  	public lng: number = 0;


	constructor(public http: Http, public zone: NgZone) {
    	//console.log('Hello LocationTracker Provider');
  	}

  	startTracking() {
	 	// Background Tracking
	 
		let config = {
			desiredAccuracy: 0,
		    stationaryRadius: 20,
		    distanceFilter: 10, 
		    debug: true,
		    interval: 2000 
		};
		 
		BackgroundGeolocation.configure((location) => {	 
		    //console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
		 
		    // Run update inside of Angular's zone
		    this.zone.run(() => {
		      	this.lat = location.latitude;
		      	this.lng = location.longitude;
		    });
		}, (err) => {
			console.log(err);
		}, config);
		 
		// Turn ON the background-geolocation system.
		BackgroundGeolocation.start();		 
		 
		// Foreground Tracking
		 
		let options = {
		    frequency: 3000, 
		    enableHighAccuracy: true
		};
		 
		this.watch = Geolocation.watchPosition(options).subscribe((position: Geoposition) => {		 
		    //console.log(position);
		 
		    // Run update inside of Angular's zone
		    this.zone.run(() => {
		    	if (typeof position.coords !== 'undefined') {
		    		this.lat = position.coords.latitude;
		      		this.lng = position.coords.longitude;
		    	}
		    });
		  });
	}
 
  	stopTracking() {
 		//console.log('stopTracking');
 
	  	BackgroundGeolocation.finish();
	  	this.watch.unsubscribe();
  	}

}
