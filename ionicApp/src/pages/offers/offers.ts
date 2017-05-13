import {Component, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Http} from "@angular/http";
import {OrderDetailsPage} from "../order-details/orderdetails";

export const FL_NAVPARAM_OFFER_ID = "offer_id";

@Component({
    selector: 'offers',
    templateUrl: 'offers.html'
})

export class OffersPage implements OnInit {
    private _restaurant_id: number;
    public offers: Object[];

    constructor(navParams: NavParams, private http: Http, private navCtrl: NavController) {
        this._restaurant_id = navParams.get("restaurant_id");
    }

    ngOnInit() {
        this._restaurant_id = 12;   // TODO: Remove this

        this.http.get(`https://localhost:8443/api/offers?restaurant_id=${this._restaurant_id}`) // TODO: Extract url to AppModule
         .subscribe(
         res => this.offers = res.json(),
         err => console.error(err)
         )
    }

    public onOfferClicked(event, offer) {
        this.navCtrl.push(OrderDetailsPage, {offer})
    }
}