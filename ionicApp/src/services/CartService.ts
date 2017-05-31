import {Injectable} from "@angular/core";
import {Offer} from "../model/Offer";

@Injectable()
export class CartService {

    private _carts: Map<number, Array<Offer>>;

    constructor() {
        this._carts = new Map();
    }

    getCart(restaurantId: number): Array<Offer> {
        return this._carts.get(restaurantId);
    }

    createCart(restaurantId: number): Array<Offer> {
        this._carts.set(restaurantId, []);
        return this.getCart(restaurantId);
    }
}