import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Restaurant} from "../../model/Restaurant";
import {Reservation} from "../../model/Reservation";
import {DatePipe} from "@angular/common";
import {Offer} from "../../model/Offer";

/**
 * This view loads a detailed reservation page
 * @author Sergej Bardin
 */
@Component({
    templateUrl: 'reservation.html'
})
export class ReservationPage {
    public reservation;
    public offers: Offer[];
    public restaurant: Restaurant;
    public points: number = 0;
    private param: Object;
    /**
     * Initialize modules and displays the points earned for this order
     * @param navParams
     */
    constructor(private navParams: NavParams, public datepipe: DatePipe) {
        this.reservation = navParams.get("reservation");
        this.restaurant = this.reservation.restaurant;
        this.points = this.reservation.points;
        this.offers = this.reservation.reservation_offers;
        this.param = {
            name: this.restaurant.name,
            points: this.points,
            collectTime: this.datepipe.transform(new Date(this.reservation.collectTime), 'dd.MM.yyyy')
        };
    }
}
