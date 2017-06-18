import {Component, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {OffersService} from "./OffersService";
import {OffersProductViewPage} from "../offers-product-view/offers-product-view";
import {Restaurant} from "../../model/Restaurant";


/**
 * Page for showing the offers of a specific restaurant in a list.
 * If the user clicks on an offer, she will get to the detail view of this offer.
 */
@Component({
    templateUrl: 'offers.html'
})
export class OffersPage implements OnInit {
    private _restaurant: Restaurant;
    public offers: any;
    public categories;

    constructor(navParams: NavParams,
                private offerService: OffersService,
                private navCtrl: NavController) {
        this._restaurant = navParams.get("restaurant");
    }

    ngOnInit() {
        this.offerService.getOffers(this._restaurant.id).subscribe(
            offers => {
                this.offers = offers;
                this.categories = Object.keys(offers);
            },
            err => console.error(err)
        )
    }

    public onOfferClicked(event, offer) {
        this.navCtrl.push(OffersProductViewPage, {offer, restaurant_id: this._restaurant})
    }
}
