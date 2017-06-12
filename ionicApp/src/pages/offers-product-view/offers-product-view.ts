import {Component, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {OffersService} from "../offers/OffersService";
import {Offer} from "../../model/Offer";
import {CartService} from "../../services/CartService";
import {OrderDetailsPage} from "../order-details/orderdetails";

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
  public cart: Array<Object>;
  private _restaurantId: number;
  private _offerId: number;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private offerService: OffersService,
      private cartService: CartService
  ) {
    this._restaurantId = navParams.get("restaurant_id");
    this._offerId = navParams.get("offer_id");
    let cart = cartService.getCart(this._restaurantId);
    if (cart === null || cart === undefined) {
      this.cart = cartService.createCart(this._restaurantId);
    } else {
      this.cart = cart;
    }
  }

  ngOnInit() {
    this.offerService.getOffers(this._restaurantId)
      // .filter(offers => offers === this.offer)
      .subscribe(offers => {
      this.offers = offers;
    })
  }

  addToCart(offer: Offer) {
    this.cart.push(offer);
  }

  goToCheckout() {
    this.navCtrl.push(OrderDetailsPage, {
      restaurant_id: this._restaurantId
    });
  }

}
