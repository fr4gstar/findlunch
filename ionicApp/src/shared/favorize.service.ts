import {Injectable} from '@angular/core';
import {Headers, Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {SERVER_URL} from "../app/app.module";

import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {AuthService} from "./auth.service";


/**
 *Service that handles the roundtrips for favorizing and defavorizing a restaurant
 */
@Injectable()

export class FavorizeService{

    constructor(public http: Http,
                private auth: AuthService) {
    }

    /**
     * toggles the "favorite" status for a user's restaurant
     * @param isFavorite boolean that provides the info whether the restaurant is a favorite at the moment
     * @param restaurantID ID of the according restraunt to (de-)favorize
     * @returns {Observable<Response>} Observable that communicates whether round trip was successful
     */
    public toggleFavorize(isFavorite: boolean, restaurantID: number): Observable<any> {
        let options: RequestOptions;
        if (isFavorite){
            options = this.auth.prepareHttpOptions(RequestMethod.Delete);
            return this.http.delete(`${SERVER_URL}/api/unregister_favorite/${restaurantID}`, options);
        } else {
            options = this.auth.prepareHttpOptions(RequestMethod.Put);
            return this.http.put(`${SERVER_URL}/api/register_favorite/${restaurantID}`, "", options);

        }
    }
}
