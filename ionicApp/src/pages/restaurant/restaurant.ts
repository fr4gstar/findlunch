import {Component, OnInit} from "@angular/core";
import {Alert, AlertController, Loading, NavParams} from "ionic-angular";
import {SERVER_URL} from "../../app/app.module";
import {Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {Restaurant} from "../../model/Restaurant";
import {AuthService} from "../../shared/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {LoadingService} from "../../shared/loading.service";
import {Error} from "tslint/lib/error";
import {FavorizeService} from "../../shared/favorize.service";

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
    private strError: string;

    constructor(private navParams: NavParams,
                private auth: AuthService,
                private http: Http,
                private fav: FavorizeService,
                private loading: LoadingService,
                private alertCtrl: AlertController,
                private translate: TranslateService) {
        this.restaurant = navParams.get("restaurant");
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
        this.translate.get('Error.general').subscribe(
            (res: string) => {
                this.strError = res;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.general.", err);
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
    /**
     * Toggles the isFavorite status of the restaurant and also sends this to the server.
     * Shows a loading animation while request is running
     * @author Skanny Morandi
     */
    public toggleIsFavorite(): void {
        // prepare loader
        const loader: Loading = this.loading.prepareLoader();
        loader.present();

        // unset as favorite if already favorite
        if (this.restaurant.isFavorite) {
            this.fav.toggleFavorize(this.restaurant.isFavorite, this.restaurant.id)
                .timeout(8000)
                .subscribe(
                    (data: Response) => {
                        if (data) {
                            this.restaurant.isFavorite = false;
                            loader.dismiss();
                        } else {
                            const alert: Alert = this.alertCtrl.create({
                                title: this.strError,
                                message: this.strErrorDeFavorize,
                                buttons: [{
                                    text: 'Ok',
                                    role: 'cancel'
                                }]
                            });
                            alert.present();
                        }
                    },
                    (err: Error) => {
                        loader.dismiss();
                        console.error("Defavorize restaurant failed.", err);
                        const alert: Alert = this.alertCtrl.create({
                            title: this.strError,
                            message: this.strErrorDeFavorize,
                            buttons: [{
                                text: 'Ok',
                                role: 'cancel'
                            }]
                        });
                        alert.present();
                    });
        // if not yet set as favorite, set it
        } else {
            this.fav.toggleFavorize(this.restaurant.isFavorite, this.restaurant.id)
                .timeout(8000)
                .subscribe(
                    (data: Response) => {
                        if (data) {
                            this.restaurant.isFavorite = true;
                            loader.dismiss();
                        } else {
                            loader.dismiss();
                            const alert: Alert = this.alertCtrl.create({
                                title: this.strError,
                                message: this.strErrorFavorize,
                                buttons: [{
                                    text: 'Ok',
                                    role: 'cancel'
                                }]
                            });
                            alert.present();
                        }
                    },
                    (err: Error) => {
                        loader.dismiss();
                        console.error("Favorize restaurant failed.", err);
                        const alert: Alert = this.alertCtrl.create({
                            title: this.strError,
                            message: this.strErrorFavorize,
                            buttons: [{
                                text: 'Ok',
                                role: 'cancel'
                            }]
                        });
                        alert.present();
                    });
        }
    }
}
