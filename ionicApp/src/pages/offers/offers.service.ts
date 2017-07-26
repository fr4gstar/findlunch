import {Injectable} from "@angular/core";
import {SERVER_URL} from "../../app/app.module";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Offer} from "../../model/Offer";

/**
 * Service for getting the Offers of a restaurant from the server and caching them in RAM.
 * @author David Sautter
 */
@Injectable()
export class OffersService {

    private _cache: Map<number, Array<Offer>>;

    constructor(private http: Http) {
        this._cache = new Map();
    }

    //TODO: Comment
    getOffers(restaurantId: number): Observable<Array<Offer>> {
        // get offers from cache if stored already
        if (this._cache.has(restaurantId)) return Observable.of(this._cache.get(restaurantId)).take(1);

        // get offers from server otherwise
        return this.http.get(`${SERVER_URL}/api/offers?restaurant_id=${restaurantId}`)
            .map(res => res.json())
            .do(offers => this._cache.set(restaurantId, offers))
    }

    //TODO:Comment
    public getALGsAndADDsOfOffer(offer: Offer) {
        return offer.allergenic
                .concat(offer.additives)
                .map(x => x.shortKey)
                .join(",") || "";
    }
}
