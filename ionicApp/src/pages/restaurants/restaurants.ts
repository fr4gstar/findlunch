import {Component} from "@angular/core";
import {NavController, LoadingController, NavParams, Platform} from "ionic-angular";
import {Http, RequestOptions, Headers} from "@angular/http";
import {Coordinates, Geolocation} from "@ionic-native/geolocation";
import {OffersPage} from "../offers/offers";
import {Restaurant} from "../../model/Restaurant";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../providers/auth-service";


@Component({
  selector: 'restaurants-page',
  templateUrl: 'restaurants.html'

})
export class RestaurantsPage {
  public restaurants$: Observable<Restaurant[]>;
  private pos : Coordinates;
  private loader;

  constructor(public navCtrl : NavController,
              private navParams:NavParams,
              private http: Http,
              private geolocation: Geolocation,
              private platform: Platform,
              private auth: AuthService,
              private loadingController: LoadingController
  ) {
      this.loader = this.loadingController.create({
          content: "Bitte warten"
      });
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
      let options= new RequestOptions();

      if(this.auth.getLoggedIn()){

          let user = window.localStorage.getItem("username");
          let token = window.localStorage.getItem(user);
          let headers = new Headers({
              'Content-Type': 'application/json',
              "Authorization": "Basic " +token
          });
          options = new RequestOptions({
              headers: headers,
          });
      }

      this.restaurants$ = this.http.get(`https://shrouded-dusk-87807.herokuapp.com/api/restaurants?latitude=48.1559834&longitude=11.6314406&radius=9999999`,options)
        .map(res => res.json())
 }

 showOffers(restaurant: String){
    this.navCtrl.push(OffersPage,{restaurant: restaurant});
 }

}
