import {Injectable} from "@angular/core";

@Injectable()
export class CartService {

    private _carts: Map<number, Array<Object>>;

    constructor() {
        this._carts = new Map();
    }

    getCart(restaurantId: number): Array<Object> {
        return this._carts.get(restaurantId);
    }

    createCart(restaurantId: number): Array<Object> {
        this._carts.set(restaurantId, []);
        return this.getCart(restaurantId);
    }
}