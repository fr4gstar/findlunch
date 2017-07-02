import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {SERVER_URL} from "../../app/app.module";
import {Headers, Http, RequestOptions} from "@angular/http";

import {Restaurant} from "../../model/Restaurant";
import {AuthService} from "../../providers/auth-service";


/**
 * This pages displays the information of a restaurant.
 */
@Component({
  selector: 'restaurant-view-page',
  templateUrl: 'restaurant-view.html'

})
export class RestaurantViewPage {
  /**
   * Restaurant, which should be displayed on page
   */
  public restaurant: Restaurant;
  public openingTime;

  /**
   * Initialize modules and gets restaurant from previous page.
   * @param navParams to get restaurant
   */
  constructor(
    public navCtrl : NavController,
    private navParams:NavParams,
    private auth: AuthService,
    private http: Http ) {

    this.restaurant = navParams.get("restaurant");
    this.openingTime = this.restaurant.timeSchedules;
    console.log("Restaurant", this.restaurant);
  }

    /**
     * Toggles the isFavorite status of the restaurant and also sends this to the server.
     */
    public toggleIsFavourite() {

        let user = window.localStorage.getItem("username");
        let token = window.localStorage.getItem(user);
        let headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": "Basic " +token
        });

        let options = new RequestOptions({
            headers: headers,
        });

        // unset as favorite
        if (this.restaurant.isFavorite) {
            this.http.delete(SERVER_URL + "/api/unregister_favorite/" + this.restaurant.id, options).subscribe(
                res => {
                    if (res.json() === 0) {
                        this.restaurant.isFavorite = false;
                    }
                    else throw new Error("Unknown return value from server: " + res.json())
                },
                err => {
                    alert("Konnte Restaurant nicht als Favorit entfernen.");
                    console.error(err);
                }
            )
        }
        // set as favorite
        else {
            this.http.put(SERVER_URL + "/api/register_favorite/" + this.restaurant.id, "", options).subscribe(
                res => {
                    if (res.json() === 0) {
                        this.restaurant.isFavorite = true;
                    }
                    else throw new Error("Unknown return value from server: " + res.json());
                },
                err => {
                    alert("Konnte Restaurant nicht als Favorit setzen.");
                    console.error(err);
                })
        }
    }
}
