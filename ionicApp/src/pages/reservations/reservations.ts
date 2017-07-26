import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {Headers, Http, RequestMethod, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {ReservationViewPage} from "../reservation-view/reservation-view";
import {Reservation} from "../../model/Reservation";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../shared/auth.service";
import {LoadingService} from "../../shared/loading.service";

/**
 * This pages loads and shows all reservation of an user.
 * @author Sergej Bardin - bardin@hm.edu
 */
@Component({
    selector: 'reservations-page',
    templateUrl: 'reservations.html'
})
export class ReservationsPage implements OnInit {
    public reservations;
    public usedRestaurants: String[];


    /**
     * Initialize modules
     * @param navCtrl
     * @param http
     */
    constructor(public navCtrl: NavController,
                private http: Http,
                private auth: AuthService,
                private loading: LoadingService,
                translate: TranslateService) {
        translate.setDefaultLang('de');
        this.usedRestaurants = [];
    }

    /**
     * Loads the reservation(s) of a user.
     */
    ngOnInit() {
        //prepare a loading spinner
        let loader = this.loading.prepareLoader();
        loader.present();

        //put together the options for http-call
        let options = this.auth.prepareHttpOptions(RequestMethod.Get);
        this.http.get(`${SERVER_URL}/api/getCustomerReservations`, options)
            .subscribe(
                res => {
                    this.reservations = res.json();
                    if (this.reservations.length > 0) {
                        this.collectUsedRestaurants();
                        ReservationsPage.sortByCollectTime(this.reservations)
                    }
                    loader.dismiss();
                },
                err => {

                    console.error(err)
                    loader.dismiss();
                }
            );
    }

    public collectUsedRestaurants() {
        for (let reservation of this.reservations) {
            if (this.usedRestaurants.indexOf(reservation.restaurant.name) === -1) {
                this.usedRestaurants.push(reservation.restaurant.name);
            }
        }

    }

    /**
     * Opens a reservation detail view on click.
     * @param event
     * @param reservation
     */
    public onReservationClicked(event, reservation: String) {
        this.navCtrl.push(ReservationViewPage, {reservation: reservation});
    }


    private static sortByCollectTime(reservations: Reservation[]) {
        reservations.sort((a, b) => {
            if (a.collectTime > b.collectTime) return -1;
            if (b.collectTime > a.collectTime) return 1;
            return 0;
        })
    }
}
