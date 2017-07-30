import {Injectable} from "@angular/core";
import {SERVER_URL} from "../../app/app.module";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Offer} from "../../model/Offer";
import 'rxjs/add/operator/do';


/**
 * Service for getting the Offers of a restaurant from the server and caching them.
 * @author David Sautter
 */
@Injectable()
export class OffersService {

    private cache: Map<number, Offer[]>;

    constructor(private http: Http) {
        this.cache = new Map();
    }


    /**
     * Builds a string with the allergenic-ids and the additive-ids of a specific offer used to display
     * at the offer's product name.
     * It extracts the data from the provided offer-object and does not fetch from the server.
     *
     * @param offer offer-object containing allergenics and additives
     * @returns {string} A string containing all id's of the allergenics and additives, e.g. '1,4,7,a,g'
     */
    public static getALGsAndADDsOfOffer(offer: Offer): string {
        return offer.allergenic
            .concat(offer.additives)
            .map((a: {shortKey: string}) => a.shortKey)
            .join(",") || "";
    }


    /**
     * Retrieves all offers of a specific restaurant from the server. Caches requests and returns
     * them from the cache if user has already executed this method with the same restaurant-id.
     *
     * @param {number} restaurantId the restaurant to retrieve the offers from
     * @returns {Observable<Offer[]>} resolves to the retrieved offers
     */
    public getOffers(restaurantId: number): Observable<Offer[]> {
        // get offers from cache if stored already
        if (this.cache.has(restaurantId)) {
            return Observable.of(this.cache.get(restaurantId)).take(1);
        }

        // get offers from server otherwise
        return this.http.get(`${SERVER_URL}/api/offers?restaurant_id=${restaurantId}`)
            .map((res: Response) => res.json())
            .do((offers: Offer[]) => this.cache.set(restaurantId, offers));
    }

}
