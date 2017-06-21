import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Reservation} from "../../model/Reservation";

@Component({
  selector: 'reservation-view-page',
  templateUrl: 'reservation-view.html'
})
export class ReservationViewPage {
  public reservation: Reservation;
  public reservation_offers;

  constructor(
    private navParams: NavParams) {
      this.reservation = navParams.get("reservation");
      this.reservation_offers =this.reservation.reservation_offers;
      console.log(this.reservation_offers);
  }

}
