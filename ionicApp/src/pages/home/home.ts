import {Component} from "@angular/core";
import {NavController, Platform} from "ionic-angular";
import {Coordinates, Geolocation} from "@ionic-native/geolocation";
import {GoogleMap, GoogleMaps, GoogleMapsEvent} from "@ionic-native/google-maps";

export const ANDROID_API_KEY = "AIzaSyAvO9bl1Yi2hn7mkTSniv5lXaPRii1JxjI";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public pos: Coordinates;


  constructor(public navCtrl: NavController, private geolocation: Geolocation, private platform: Platform, private googleMaps: GoogleMaps) {
    this.platform.ready().then(() => this.getGeolocation())
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
  }


  private loadMap() {
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    let map: GoogleMap = this.googleMaps.create(element);

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker
      }
    );
  }


  private getGeolocation() {
    this.geolocation.getCurrentPosition().then((res) => {
      this.pos = res.coords;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  sendToWeb() {
    // Add Serverkey and Webtoken here
    var webKey = 'SERVERKEY-API';
    var toWeb = 'WEB-TOKEN';

    let notification = {
      'title': 'Bestellung XY eingegangen',
      'body': 'Kunde: Maximilian Mustermann',
      'icon': '/assets/icon/favicon.ico',
      'click_action': 'http://localhost:8100'
    };

    fetch('https://fcm.googleapis.com/fcm/send', {
      'method': 'POST',
      'headers': {
        'Authorization': 'key=' + webKey,
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify({
        'notification': notification,
        'to': toWeb
      })
    }).then(function(response) {
      console.log(response);
    }).catch(function(error) {
      console.error(error);
    })

  }

  sendToAndroid() {
    // Add Serverkey and Android Token
    var androidKey = 'SERVERKEY-API';
    var toAndroid = 'ANDROID-TOKEN';

    let notification = {
      'title': 'Bestätigung der Bestellung XY',
      'body': 'Abholbereit in ca. 20 min',
      'icon': 'firebase-logo.png',
      'click_action': 'http://localhost:8100'
    };

    fetch('https://fcm.googleapis.com/fcm/send', {
      'method': 'POST',
      'headers': {
        'Authorization': 'key=' + androidKey,
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify({
        'notification': notification,
        'to': toAndroid
      })
    }).then(function(response) {
      console.log(response);
    }).catch(function(error) {
      console.error(error);
    })

  }

}
