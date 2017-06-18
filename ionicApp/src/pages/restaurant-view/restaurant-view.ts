import {Component} from "@angular/core";
import {NavController, NavParams, Platform} from "ionic-angular";
import {Http} from "@angular/http";
import {Coordinates, Geolocation} from "@ionic-native/geolocation";
import {SERVER_URL} from "../../app/app.module";
import {OffersPage} from "../offers/offers";
import {Restaurant} from "../../model/Restaurant";
import {Observable} from "rxjs/Observable";


@Component({
  selector: 'restaurant-view-page',
  templateUrl: 'restaurant-view.html'

})
export class RestaurantViewPage {

  public restaurant: Restaurant;

  constructor(
    public navCtrl : NavController,
    private navParams:NavParams,
    private platform: Platform) {

    this.restaurant = navParams.get("restaurant");
  }
}
