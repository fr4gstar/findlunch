import {Component, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {OffersService} from "./OffersService";
import {OffersProductViewPage} from "../offers-product-view/offers-product-view";
import {Restaurant} from "../../model/Restaurant";
import {RestaurantViewPage} from "../restaurant-view/restaurant-view";


/**
 * Page for showing the offers of a specific restaurant in a list.
 * If the user clicks on an offer, she will get to the detail view of this offer.
 */
@Component({
    templateUrl: 'offers.html'
})
export class OffersPage implements OnInit {
    public restaurant: Restaurant;
    public offers: any;
    public categories;

    constructor(navParams: NavParams,
                private offerService: OffersService,
                private navCtrl: NavController) {
        this.restaurant = navParams.get("restaurant");
    }

    ngOnInit() {
        this.offerService.getOffers(this.restaurant.id).subscribe(
            offers => {
                this.offers = offers;
                this.categories = Object.keys(offers);
            },
            err => console.error(err)
        )
    }

    public onOfferClicked(event, offer) {
        this.navCtrl.push(OffersProductViewPage, {offer, restaurant: this.restaurant})
    }

  public onRestaurantClicked(event) {
    this.navCtrl.push(RestaurantViewPage, {restaurant: this.restaurant})
  }
}
