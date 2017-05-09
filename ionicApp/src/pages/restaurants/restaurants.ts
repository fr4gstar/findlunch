import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {Http} from "@angular/http";

@Component({
  selector: 'restaurants-page',
  templateUrl: 'restaurants.html'

})
export class RestaurantsPage {
  pos: Coordinates;
  public restaurants : Object[];
  // coordinates pos von Homepage holen
  // Wert für Radius möglich machen anzugeben
  // Koordinaten und radius in API Call mit reinpacken
  // json zurückbekommen
  // durch json iterieren und für jedes Element einen div
  //
  //
  constructor(public navCtrl : NavController, private navParams:NavParams, private http: Http  ) {
  //  this.pos = navParams.get('pos');

  }

  showRestaurants(/*pos : Coordinates, radius : number*/){
    this.http.get('https://findlunch.biz.tm:8444/api/restaurants?latitude=48.154696&longitude=11.54638&radius=500')
   .subscribe(
   res => this.restaurants = res.json(),
   err => console.error(err)
  )
 }
}
