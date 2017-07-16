import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {Headers, Http, RequestMethod, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {ReservationViewPage} from "../reservation-view/reservation-view";
import {Reservation} from "../../model/Reservation";
import {LoadingService} from "../../providers/loading-service";

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
                private loading: LoadingService) {

        this.usedRestaurants = [];

    }

    /**
     * Loads the reservations of an user.
     */
    ngOnInit() {
        let user = window.localStorage.getItem("username");
        let token = window.localStorage.getItem(user);
        let headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": "Basic " + token
        });

        let options = new RequestOptions({
            headers: headers,
            method: RequestMethod.Get
        });

        let loader = this.loading.prepareLoader("Bestellungen laden...");
        loader.present().then(res => {


            this.http.get(`${SERVER_URL}/api/getCustomerReservations`, options)
                .subscribe(
                    res => {

                        this.reservations = res.json();
                        if(this.reservations.length > 0){
                            this.collectUsedRestaurants();
                            ReservationsPage.sortByCollectTime(this.reservations)
                         }


                    },
                    err => console.error(err)
                );
            loader.dismiss();
        })
    }

    /**
     * Puts every restaurant name into the "usedRestaurants"-Array exactly once
     * if a user has points of that restaurant
     */
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