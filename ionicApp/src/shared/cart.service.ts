import {Injectable} from "@angular/core";
import {Offer} from "../model/Offer";

/**
 * Manages all carts for all restaurants (not just one).
 * The carts are not stored in localStorage etc, just in the RAM, so they are lost on reload.
 *
 * @author David Sautter
 */
@Injectable()
export class CartService {

    // a map holding all carts for all restaurants. The key is the restaurant-id.
    private carts: Map<number, Offer[]>;

    constructor() {
        this.carts = new Map();
    }


    /**
     * Gets a existing cart or creates one if none exists.
     *
     * @param restaurantId id of the restaurant to create this cart for
     * @returns {Offer[]} cart for this restaurant
     */
    public getCart(restaurantId: number): Offer[] {
        return this.carts.get(restaurantId) || this.createCart(restaurantId);
    }


    /**
     * Calculates the size of the cart.
     * If multiple items of one offer are in the cart, it will sum up the items.
     *
     * @param restaurantId id of the restaurant to identify the right cart
     * @returns {number} amount of items in cart
     */
    public getCartItemCount(restaurantId: number): number {
        return this.getCart(restaurantId)
            .map((offer: Offer) => offer.amount)
            .reduce((prevAmount: number, amount: number) => prevAmount + amount, 0);
    }


    /**
     * Adding an offer to a specific cart. It either increases the amount of this offer by 1
     * or pushes a new offer to this cart with amount 1, if it doesn't exist in this cart yet.
     *
     * @param restaurantId id of the restaurant to identify the right cart
     * @param offer the offer that shall be added to the cart
     */
    public addItemToCart(restaurantId: number, offer: Offer): void {
        const item: Offer = this.getCart(restaurantId)
            .find((offerInCart: Offer) => offerInCart.id === offer.id);

        if (item) {
            item.amount++;

        } else {
            offer.amount = 1;
            this.getCart(restaurantId).push(offer);
        }
    }


    /**
     * Convenience-method for removing all items from a given cart (mostly after sending the order).
     * Internally it just creates a new cart for this restaurant, so the old one gets garbage collected.
     *
     * @param restaurantId id of the restaurant to identify the right cart
     */
    public emptyCart(restaurantId: number): void {
        this.createCart(restaurantId);
    }

    /**
     * Creates a new cart for the provided restaurant and returns it.
     *
     * @param restaurantId id of the restaurant to identify the right cart
     * @returns {Offer[]} the new cart
     */
    private createCart(restaurantId: number): Offer[] {
        this.carts.set(restaurantId, []);
        return this.carts.get(restaurantId);
    }
}
