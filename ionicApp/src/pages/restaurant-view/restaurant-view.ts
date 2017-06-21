import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Restaurant} from "../../model/Restaurant";

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

  /**
   * Initialize modules and gets restaurant from previous page.
   * @param navParams to get restaurant
   */
  constructor(
    private navParams:NavParams) {

    this.restaurant = navParams.get("restaurant");
  }
}
