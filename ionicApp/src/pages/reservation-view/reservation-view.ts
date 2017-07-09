import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Reservation} from "../../model/Reservation";
import {Restaurant} from "../../model/Restaurant";
import {forEachToken} from "tslint";
import {Offer} from "../../model/Offer";

/**
 * This view loads a detailed reservation page
 */
@Component({
    selector: 'reservation-view-page',
    templateUrl: 'reservation-view.html'
})
export class ReservationViewPage {
    public reservation;
    public offers = [];
    public restaurant: Restaurant;
    public points = 0;


    /**
     * Initialize modules and displays the points earned for this order
     * @param navParams
     */
    constructor(private navParams: NavParams) {
        this.reservation = navParams.get("reservation");
        this.restaurant = this.reservation.restaurant;
        this.points = this.reservation.points;
        this.offers= this.reservation.reservation_offers;
        debugger;
           console.log(this.offers[0].offer.amount);
           console.log(this.offers[0]);

    }
}
