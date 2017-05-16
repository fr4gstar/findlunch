import {Component, OnInit} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Http} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";

export const FL_NAVPARAM_RESTAURANT_ID = "restaurant_id";   // TODO: Move this to restaurant-selection-page
export const FL_NAVPARAM_OFFER_ID = "offer_id";

@Component({
    selector: 'offers',
    templateUrl: 'offers.html'
})
export class OffersPage implements OnInit {
    private _restaurant_id: String;
    public offers: Object[];

    constructor(navParams: NavParams, private http: Http) {
        this._restaurant_id = navParams.get('restaurant_id');
    }

    ngOnInit() {

        this.http.get(`${SERVER_URL}/api/offers?restaurant_id=${this._restaurant_id}`)
         .subscribe(
         res => this.offers = res.json(),
         err => console.error(err)
         )
    }

    public onOfferClicked(event, offer) {
        // TODO: Push to next site
    }
}
