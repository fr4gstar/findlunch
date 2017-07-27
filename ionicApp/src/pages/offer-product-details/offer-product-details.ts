import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Offer} from "../../model/Offer";
import {CartService} from "../../shared/cart.service";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {Restaurant} from "../../model/Restaurant";
import {OffersService} from "../offers/offers.service";
import {TranslateService} from "@ngx-translate/core";

/**
 * Page for showing the details of a offered product.
 * Offer and restaurant-id must be provided via navParams ("restaurant", "offer").
 * This page enables adding the item to the cart and shows the number of items in cart in the header.
 * @author Daivd Sautter
 */
@Component({
  templateUrl: 'src/pages/offer-product-details/offer-product-details.html'
})
export class OfferProductDetailsPage {

  public cart: Object[];
  public restaurant: Restaurant;
  public offer: Offer;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private cartService: CartService,
      public offersService: OffersService,
      public translate: TranslateService
  ) {
      this.restaurant = navParams.get("restaurant");
      this.offer = navParams.get("offer");
    // get cart for this restaurant
      this.cart = cartService.getCart(this.restaurant.id);
  }
    //TODO: comment
  addToCart(offer: Offer) {
    this.cartService.addItemToCart(this.restaurant.id, offer);
  }
    //TODO: comment
  getCartItemCount() {
    return this.cartService.getCartItemCount(this.restaurant.id);
  }

    //TODO: comment
  goToOrderDetailsPage() {
    this.navCtrl.push(OrderDetailsPage, {
      restaurant: this.restaurant
    });
  }

}
