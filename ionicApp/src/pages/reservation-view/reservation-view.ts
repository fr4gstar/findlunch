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
  public reservation: Reservation;
  public reservation_offers;
  public restaurant: Restaurant;
  public points = 0;

  /**
   * Initialize modules and sums the points
   * @param navParams
   */
  constructor(private navParams: NavParams)
  {
      this.reservation = navParams.get("reservation");
      this.reservation_offers = this.reservation.reservation_offers;
      this.restaurant = this.reservation.restaurant;
      this.sumPoints();
  }

  /**
   * Sums the points from all
   */
  sumPoints(){
    // TODO anpassen auf die richtige property
    for(let offer of this.reservation_offers) {
      this.points = this.points + offer.offer.neededPoints;
    }
  }
}
