import {Component} from "@angular/core";
import {NavController, NavParams, Platform} from "ionic-angular";
import {Http} from "@angular/http";
import {Coordinates, Geolocation} from "@ionic-native/geolocation";
import {SERVER_URL} from "../../app/app.module";
import {OffersPage} from "../offers/offers";
import {Restaurant} from "../../model/Restaurant";
import {Observable} from "rxjs/Observable";


@Component({
  selector: 'restaurants-page',
  templateUrl: 'restaurants.html'

})
export class RestaurantsPage {
  public restaurants$: Observable<Restaurant[]>;
  private pos : Coordinates;

  constructor(public navCtrl : NavController, private navParams:NavParams, private http: Http, private geolocation: Geolocation, private platform: Platform) {
    this.platform.ready().then(() => this.getGeolocation()  )
  }

  private getGeolocation() {
      this.geolocation.getCurrentPosition().then((res) => {
        this.pos = res.coords;
      }).catch((error) => {
        console.error('Error getting location', error);
      });
    }
  showRestaurants(radius : String) {
    this.restaurants$ = this.http.get(`${SERVER_URL}/api/restaurants?latitude=${this.pos.latitude}&longitude=${this.pos.longitude}&radius=${radius}`)
        .map(res => res.json())
 }

 showOffers(restaurant: String){
    this.navCtrl.push(OffersPage,{restaurant: restaurant});
 }

}
