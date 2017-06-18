import {Injectable} from "@angular/core";
import {Offer} from "../model/Offer";

@Injectable()
export class CartService {

    private _carts: Map<number, Array<Offer>>;

    constructor() {
        this._carts = new Map();
    }

    getCart(restaurantId: number): Array<Offer> {
        return this._carts.get(restaurantId) || this.createCart(restaurantId);
    }

    getCartItemCount(restaurantId: number) {
        return this.getCart(restaurantId)
            .map(offer => offer.amount)
            .reduce((prevAmount, amount) => prevAmount + amount, 0)
    }

    addItemToCart(restaurantId: number, offer: Offer) {
        let item = this.getCart(restaurantId)
            .find((item, i) => {
                return item.id === offer.id;
            });

        if (item) {
            item.amount++;
            console.log("item amount erhöht auf: ", item.amount);

        } else {
            offer.amount = 1;
            this.getCart(restaurantId).push(offer);
            console.log("item hinzugefügt");
        }
    }

    createCart(restaurantId: number): Array<Offer> {
        this._carts.set(restaurantId, []);
        return this._carts.get(restaurantId);
    }
}
