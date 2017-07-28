import {Component, OnInit} from "@angular/core";
import {Loading, NavParams} from "ionic-angular";
import {SERVER_URL} from "../../app/app.module";
import {Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {Restaurant} from "../../model/Restaurant";
import {AuthService} from "../../shared/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {LoadingService} from "../../shared/loading.service";
import {Error} from "tslint/lib/error";

/**
 * This pages displays the information of a restaurant.
 * @author Sergej Bardin - Skanny Morandi
 */
@Component({
    templateUrl: 'restaurant.html'

})
export class RestaurantPage implements OnInit {
    public restaurant: Restaurant;
    public openingTime: Object[];

    private strErrorFavorize: string;
    private strErrorDeFavorize: string;

    constructor(private navParams: NavParams,
                private auth: AuthService,
                private http: Http,
                private loading: LoadingService,
                private translate: TranslateService) {
        this.restaurant = navParams.get("restaurant");
        // TODO Backend or check null
        this.openingTime = this.restaurant.timeSchedules;
    }

    public ngOnInit(): void {
        this.translate.get('Error.favorize').subscribe(
            (res: string) => {
                this.strErrorFavorize = res;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.favorize.", err);
            }
        );
        this.translate.get('Error.deFavorize').subscribe(
            (res: string) => {
                this.strErrorDeFavorize = res;
                },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.deFavorize.", err);
            }
        );
    }
    //TODO -> service
    /**
     * Toggles the isFavorite status of the restaurant and also sends this to the server.
     */
    public toggleIsFavourite(): void {

        const loader: Loading = this.loading.prepareLoader();
        loader.present();
        // unset as favorite
        if (this.restaurant.isFavorite) {

            const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Delete);
            this.http.delete(`${SERVER_URL}/api/unregister_favorite/${this.restaurant.id}`, options)
                .retry(2)
                .subscribe(
                    (res: Response) => {
                    if (res.json() === 0) {
                        this.restaurant.isFavorite = false;
                        //dismiss loading spinner
                        loader.dismiss();

                    } else {
                      throw new Error(`Unknown return value from server: ${res.json()}`);
                    }
                },
                    (err: Error) => {
                    alert(this.strErrorDeFavorize);
                    console.error("Defavorize restaurant failed.", err);
                }
            );
        } else {
            // set as favorite
            const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Put);
            this.http.put(`${SERVER_URL}/api/register_favorite/${this.restaurant.id}`, "", options)
                .retry(2)
                .subscribe(
                (res: Response) => {
                    if (res.json() === 0) {
                        this.restaurant.isFavorite = true;
                        //dismiss loading spinner
                        loader.dismiss();

                    } else {
                        throw new Error(`Unknown return value from server: ${res.json()}`);
                    }
                },
                (err: Error) => {
                    alert(this.strErrorFavorize);
                    console.error("Favorize restaurant failed.", err);
                });
        }
    }
}
