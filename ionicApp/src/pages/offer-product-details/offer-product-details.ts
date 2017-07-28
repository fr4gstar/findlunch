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
    templateUrl: './offer-product-details.html'
})
export class OfferProductDetailsPage {

    public cart: Offer[];
    public restaurant: Restaurant;
    public offer: Offer;

    // need this to be able to call a static function from the template
    public getALGsAndADDsOfOffer: Function = OffersService.getALGsAndADDsOfOffer;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private cartService: CartService,
                public offersService: OffersService,
                public translate: TranslateService) {
        this.restaurant = navParams.get("restaurant");
        this.offer = navParams.get("offer");
        // get cart for this restaurant
        this.cart = cartService.getCart(this.restaurant.id);
    }

    /**
     * Adds the offer to the restaurant's cart.
     * @param {Offer} offer offer, that should be added to the cart
     */
    public addToCart(offer: Offer): void {
        this.cartService.addItemToCart(this.restaurant.id, offer);
    }


    /**
     * Retrieves the number of items, that are currently in the cart for this restaurant.
     * @returns {number} count of items in cart
     */
    public getCartItemCount(): number {
        return this.cartService.getCartItemCount(this.restaurant.id);
    }


    /**
     * Navigates to the order-details-page for this restaurant.
     */
    public goToOrderDetailsPage(): void {
        this.navCtrl.push(OrderDetailsPage, {
            restaurant: this.restaurant
        });
    }

}
