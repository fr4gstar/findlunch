import {Component, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {OffersService} from "./OffersService";
import {OffersProductViewPage} from "../offers-product-view/offers-product-view";

export const FL_NAVPARAM_OFFER_ID = "offer_id";

@Component({
    selector: 'offers',
    templateUrl: 'offers.html'
})

export class OffersPage implements OnInit {
    private _restaurant_id: number;
    public offers: Object[];

    constructor(
        navParams: NavParams,
        private offerService: OffersService,
        private navCtrl: NavController
    ) {
        this._restaurant_id = parseInt(navParams.get("restaurant_id"), 10);
    }

    ngOnInit() {
        this.offerService.getOffers(this._restaurant_id).subscribe(
            offers => this.offers = offers,
            err => alert(err)
        )
    }

    public onOfferClicked(event, offer) {
        this.navCtrl.push(OffersProductViewPage, {offer, restaurant_id: this._restaurant_id})
    }
}
