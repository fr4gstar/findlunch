import {Component, OnInit} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Http} from "@angular/http";

export const FL_NAVPARAM_RESTAURANT_ID = "restaurant_id";   // TODO: Move this to restaurant-selection-page
export const FL_NAVPARAM_OFFER_ID = "offer_id";

@Component({
    selector: 'offers',
    templateUrl: 'offers.html'
})
export class OffersPage implements OnInit {
    private _restaurant_id: number;
    public offers: Object[];

    constructor(navParams: NavParams, private http: Http) {
        this._restaurant_id = navParams.get(FL_NAVPARAM_RESTAURANT_ID);
    }

    ngOnInit() {
        this._restaurant_id = 11;   // TODO: Remove this

        /*this.http.get(`https://findlunch.biz.tm:8444/api/offers?restaurant_id=${this._restaurant_id}`) // TODO: Extract url to AppModule
         .subscribe(
         res => this.offers = res.json(),
         err => console.error(err)
         )*/

        // TODO: Remove this fake-response, as soon as local server sends "Access-Control-Allow-Origin" header.
        setTimeout(() => {
            this.offers = [
                {
                    "id": 1,
                    "description": "vegan",
                    "preparationTime": 2,
                    "price": 1,
                    "title": "Champignonreispfanne (Tg1) ",
                    "defaultPhoto": null,
                    "neededPoints": 30
                },
                {
                    "id": 2,
                    "description": "Rindfleisch und Schweinefleisch",
                    "preparationTime": 4,
                    "price": 1.9,
                    "title": "Hackbällchen mit Paprikasauce (Tg3)",
                    "defaultPhoto": null,
                    "neededPoints": 35
                },
                {
                    "id": 3,
                    "description": "fleischlos",
                    "preparationTime": 3,
                    "price": 1.59,
                    "title": "Pfannkuchen mit Schokosauce (Tg2)",
                    "defaultPhoto": null,
                    "neededPoints": 25
                },
                {
                    "id": 4,
                    "description": "Putenfleisch",
                    "preparationTime": 5,
                    "price": 2.4,
                    "title": "Putengulasch (Tg4) ",
                    "defaultPhoto": null,
                    "neededPoints": 37
                }
            ];
        }, 200)
    }

    public onOfferClicked(event, offer) {
        // TODO: Push to next site
    }
}