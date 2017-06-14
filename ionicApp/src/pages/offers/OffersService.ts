import {Injectable} from "@angular/core";
import {SERVER_URL} from "../../app/app.module";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Offer} from "../../model/Offer";

@Injectable()
export class OffersService {

    private _cache: Map<number, Array<Offer>>;

    constructor(private http: Http) {
        this._cache = new Map();
    }

    getOffers(restaurantId: number): Observable<Array<Offer>> {
        if (this._cache.has(restaurantId)) return Observable.of(this._cache.get(restaurantId)).take(1);
        return this.http.get(`${SERVER_URL}/api/offers?restaurant_id=${restaurantId}`)
            .map(res => res.json())
            .do(offers => this._cache.set(restaurantId, offers))
            .do(console.log)
    }
}
