import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Offer} from "../../model/Offer";
import {CartService} from "../../services/CartService";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {AuthService} from "../../providers/auth-service";

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
export class OffersProductViewPage {

  public cart: Array<Object>;
  private _restaurantId: number;
  public offer: Offer;
  private loggedIn;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private cartService: CartService,
      private auth : AuthService
  ) {
    this._restaurantId = navParams.get("restaurant_id");
    this.offer = navParams.get("offer");
    console.debug(this.offer);

    // get cart for this restaurant
    let cart = cartService.getCart(this._restaurantId);
    if (cart === null || cart === undefined) {
      this.cart = cartService.createCart(this._restaurantId);
    } else {
      this.cart = cart;
    }
  }

  addToCart(offer: Offer) {
    this.cartService.addItemToCart(this._restaurantId, offer);
  }


  goToCheckout() {
    this.navCtrl.push(OrderDetailsPage, {
      restaurant_id: this._restaurantId
    });
  }

}
