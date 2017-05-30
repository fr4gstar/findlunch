import {Component, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {OffersService} from "../offers/OffersService";
import {Offer} from "../../model/Offer";

/**
 * Generated class for the OffersProductViewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-offers-product-view',
  templateUrl: 'offers-product-view.html',
})
export class OffersProductViewPage implements OnInit {

  public offers: Offer[];

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private offerService: OffersService
  ) {
  }

  ngOnInit() {
    this.offerService.getOffers(this.navParams.get("restaurant_id")).subscribe(offers => {
      this.offers = offers;
    })
  }

}
