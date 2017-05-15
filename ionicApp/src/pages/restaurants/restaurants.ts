import { Component } from '@angular/core';
import {NavController, NavParams, Platform} from "ionic-angular";
import {Http} from "@angular/http";
import {Coordinates, Geolocation} from '@ionic-native/geolocation';
import {SERVER_URL} from "../../app/app.module";


@Component({
  selector: 'restaurants-page',
  templateUrl: 'restaurants.html'

})
export class RestaurantsPage {
  public restaurants : Object[];
  private pos : Coordinates;
  // coordinates pos von Homepage holen
  // Wert für Radius möglich machen anzugeben
  // Koordinaten und radius in API Call mit reinpacken
  // json zurückbekommen
  // durch json iterieren und für jedes Element einen div
  //
  //
  constructor(public navCtrl : NavController, private navParams:NavParams, private http: Http, private geolocation: Geolocation, private platform: Platform) {
    this.platform.ready().then(() => this.getGeolocation()  )
  }

  private getGeolocation() {
      this.geolocation.getCurrentPosition().then((res) => {
        this.pos = res.coords;
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }
  showRestaurants(radius : String){
    this.http.get(`${SERVER_URL}/api/restaurants?latitude=${this.pos.latitude}&longitude=${this.pos.longitude}&radius=${radius}`)
   .subscribe(
   res => this.restaurants = res.json(),
   err => console.error(err)
  )
 }
}
