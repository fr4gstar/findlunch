import {Injectable} from "@angular/core";
import {Offer} from "../model/Offer";

/**
 * Manages all carts for all restaurants.
 */
@Injectable()
export class CartService {

    // a map holding all carts for all restaurants. The key is the restaurant-id.
    private _carts: Map<number, Array<Offer>>;

    constructor() {
        this._carts = new Map();
    }

    /**
     * Gets a existing cart or creates one if none exists
     * @param restaurantId
     * @returns {Array<Offer>}
     */
    getCart(restaurantId: number): Array<Offer> {
        return this._carts.get(restaurantId) || this.createCart(restaurantId);
    }

    /**
     * Calculates the size of the cart.
     * If multiple items of one offer are in the cart, it will sum up the items.
     * @param restaurantId
     * @returns {number} amount of items in cart
     */
    getCartItemCount(restaurantId: number) {
        return this.getCart(restaurantId)
            .map(offer => offer.amount)
            .reduce((prevAmount, amount) => prevAmount + amount, 0)
    }

    /**
     * Adding an offer to a specific cart. It either increases the amount of this offer by 1
     * or pushes a new offer to this cart with amount 1, if it doesn't exist in this cart.
     * @param restaurantId
     * @param offer
     */
    addItemToCart(restaurantId: number, offer: Offer) {
        let item = this.getCart(restaurantId)
            .find((item, i) => item.id === offer.id);

        if (item) {
            item.amount++;

        } else {
            offer.amount = 1;
            this.getCart(restaurantId).push(offer);
        }
    }


    /**
     * Convenience-method for removing all items from a given cart (mostly after sending the order).
     * @param restaurantId
     */
    emptyCart(restaurantId: number) {
        this.createCart(restaurantId);
    }

    /**
     * Creates a new cart for the provided restaurant and returns it.
     * @param restaurantId
     * @returns {Array<Offer>}
     */
    private createCart(restaurantId: number): Array<Offer> {
        this._carts.set(restaurantId, []);
        return this._carts.get(restaurantId);
    }
}
