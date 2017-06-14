import { Component } from '@angular/core';
import {NavController, NavParams, Platform} from "ionic-angular";
import {Http} from "@angular/http";
import {Coordinates, Geolocation} from '@ionic-native/geolocation';
import {SERVER_URL} from "../../app/app.module";
import {OffersPage} from "../offers/offers";


@Component({
  selector: 'restaurants-page',
  templateUrl: 'restaurants.html'

})
export class RestaurantsPage {
  public restaurants : Object[];
  private pos : Coordinates;

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

 showOffers(restaurant_id: String){
    this.navCtrl.push(OffersPage,{restaurant_id: restaurant_id});
 }

}
