import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Offer} from "../../model/Offer";
import {CartService} from "../../services/CartService";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {Restaurant} from "../../model/Restaurant";

/**
 * Page for showing the details of a specific offer.
 * Offer and restaurant-id must be provided via navParams ("restaurant", "offer").
 * This view enables adding the item to the cart and shows the number of items in cart in the header.
 */
@Component({
  selector: 'page-offers-product-view',
  templateUrl: 'offers-product-view.html',
})
export class OffersProductViewPage {

  public cart: Array<Object>;
  private _restaurant: Restaurant;
  public offer: Offer;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private cartService: CartService,
  ) {
    this._restaurant = navParams.get("restaurant");
    this.offer = navParams.get("offer");

    // get cart for this restaurant
    this.cart = cartService.getCart(this._restaurant.id);
  }

  addToCart(offer: Offer) {
    this.cartService.addItemToCart(this._restaurant.id, offer);
  }

  getCartItemCount() {
    return this.cartService.getCartItemCount(this._restaurant.id);
  }


  goToOrderDetailsPage() {
    this.navCtrl.push(OrderDetailsPage, {
      restaurant_id: this._restaurant
    });
  }

}
