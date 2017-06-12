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
    public offers: any;

    constructor(
        navParams: NavParams,
        private offerService: OffersService,
        private navCtrl: NavController
    ) {
        this._restaurant_id = parseInt(navParams.get("restaurant_id"));

    }

    ngOnInit() {
        this.offerService.getOffers(this._restaurant_id).subscribe(
            offers => {this.offers = Object.keys(offers),
                      console.log(this.offers),
                      console.log("offers hat den typ :" + typeof this.offers)
                      for(let coursetype of this.offers){
                        console.log(coursetype)
                        console.log(offers[coursetype])
                      }
                        /*
                        for (let coursetype of this.offers){
                          console.log("offers.coursetype hat den typ: " +typeof this.offers.courseType)
                          console.log(this.offers.coursetype)
                          for (let i=0; i< this.offers.coursetype.length; i++){
                            console.log(this.offers.courseType.food[i].title)
                          }
                        }
                        */
                      },

            err => alert(err)
        )
    }

    public onOfferClicked(event, offer) {
        this.navCtrl.push(OffersProductViewPage, {offer, restaurant_id: this._restaurant_id})
    }
}
