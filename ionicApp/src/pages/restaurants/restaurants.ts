import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import { Http } from "@angular/http";


@Component({
  selector: 'restaurants-page',
  templateUrl: 'restaurants.html'
})
export class RestaurantsPage {
  pos: Coordinates;
  restaurants : Object[];
  // coordinates pos von Homepage holen
  // Wert für Radius möglich machen anzugeben
  // Koordinaten und radius in API Call mit reinpacken
  // json zurückbekommen
  // durch json iterieren und für jedes Element einen div
  //
  //
  constructor(public navCtrl : NavController, private navParams:NavParams, http: Http ) {
  //  this.pos = navParams.get('pos');

  }/* wenn die api dann mal geht
  showRestaurants(pos : Coordinates, radius : number){
    this.http.get('https://findlunch.biz.tm:8444/api//restaurants?latitude=['+pos.latitude+']&longitude=['+pos.longitude+ ']&radius=['+radius+']')
   .subscribe(
   res => this.restaurants = res.json(),
   err => console.error(err);
 }
*/
}
