import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {SERVER_URL} from "../../app/app.module";
import {Http, RequestMethod} from "@angular/http";

import {Restaurant} from "../../model/Restaurant";
import {AuthService} from "../../providers/auth-service";
import {TranslateService} from "@ngx-translate/core";
import {LoadingService} from "../../providers/loading-service";


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

    private errorFavorize;
    private errorDeFavorize;

    /**
     * Initialize modules and gets restaurant from previous page.
     * @param navParams to get restaurant
     */
    constructor(public navCtrl: NavController,
                private navParams: NavParams,
                private auth: AuthService,
                private http: Http,
                private loading: LoadingService,
                private translate: TranslateService) {
        translate.setDefaultLang('de');
        this.translate.get('Error.favorize').subscribe(
            (res: string) => {
                this.errorFavorize = res
            }
        )
        this.translate.get('Error.deFavorize').subscribe(
            (res: string) => {
                this.errorDeFavorize = res
            }
        )

        this.restaurant = navParams.get("restaurant");
        this.openingTime = this.restaurant.timeSchedules;
    }

    /**
     * Toggles the isFavorite status of the restaurant and also sends this to the server.
     */
    public toggleIsFavourite() {

        let loader = this.loading.prepareLoader();
        loader.present();
        // unset as favorite
        if (this.restaurant.isFavorite) {

            let options = this.auth.prepareHttpOptions(RequestMethod.Delete);
            this.http.delete(SERVER_URL + "/api/unregister_favorite/" + this.restaurant.id, options).subscribe(
                res => {
                    if (res.json() === 0) {
                        this.restaurant.isFavorite = false;
                        //dismiss loading spinner
                        loader.dismiss();


                    }
                    else throw new Error("Unknown return value from server: " + res.json())
                },
                err => {
                    alert(this.errorDeFavorize);
                    console.error(err);
                }
            )
        }
        // set as favorite
        else {
            let options = this.auth.prepareHttpOptions(RequestMethod.Put);
            this.http.put(SERVER_URL + "/api/register_favorite/" + this.restaurant.id, "", options).subscribe(
                res => {
                    if (res.json() === 0) {
                        this.restaurant.isFavorite = true;
                        //dismiss loading spinner
                        loader.dismiss();

                    }
                    else throw new Error("Unknown return value from server: " + res.json());
                },
                err => {
                    alert(this.errorFavorize);
                    console.error(err);
                })
        }
    }
}
