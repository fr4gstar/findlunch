import {Component, OnInit} from "@angular/core";
import {NavController, NavParams, Platform} from "ionic-angular";
import {OffersService} from "./OffersService";
import {OffersProductViewPage} from "../offers-product-view/offers-product-view";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {Restaurant} from "../../model/Restaurant";
import {RestaurantViewPage} from "../restaurant-view/restaurant-view";
import {Observable} from "rxjs/Observable";
import {Headers, Http, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {CartService} from "../../services/CartService";
import {AuthService} from "../../providers/auth-service";


/**
 * Page for showing the offers of a specific restaurant in a list.
 * If the user clicks on an offer, she will get to the detail view of this offer.
 */
@Component({
    templateUrl: 'offers.html'
})
export class OffersPage implements OnInit {
    public restaurant: Restaurant;
    public offers: any;
    public categories;
    shownGroup = null;

    allergenics$: Observable<any>;
    additives$: Observable<any>;

    constructor(navParams: NavParams,
                public offerService: OffersService,
                private cartService: CartService,
                private navCtrl: NavController,
                private http: Http,
                public auth: AuthService,
                private platform: Platform
    ) {
        this.restaurant = navParams.get("restaurant");

        // disable animation, because it causes problems with displaying the map on iOS
        platform.ready().then(() => {
            platform.registerBackButtonAction(() => {
                this.navCtrl.pop({animate: false});
            })
        })
    }


    ngOnInit() {
        this.offerService.getOffers(this.restaurant.id).subscribe(
            offers => {
                this.offers = offers;
                this.categories = Object.keys(offers);
                this.shownGroup = this.categories[0] || null;
            },
            err => console.error(err)
        );

        this.allergenics$ = this.http.get(SERVER_URL + "/api/all_allergenic").map(res => res.json());
        this.additives$ = this.http.get(SERVER_URL + "/api/all_additives").map(res => res.json());
    }

    public onOfferClicked(event, offer) {
        this.navCtrl.push(OffersProductViewPage, {offer, restaurant: this.restaurant})
    }

    public onRestaurantClicked(event) {
        this.navCtrl.push(RestaurantViewPage, {restaurant: this.restaurant})
    }

    /**
     * Toggles the isFavorite status of the restaurant and also sends this to the server.
     */
    public toggleIsFavourite() {

        let user = window.localStorage.getItem("username");
        let token = window.localStorage.getItem(user);
        let headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": "Basic " + token
        });

        let options = new RequestOptions({
            headers: headers,
        });

        // unset as favorite
        if (this.restaurant.isFavorite) {
            this.http.delete(SERVER_URL + "/api/unregister_favorite/" + this.restaurant.id, options).subscribe(
                res => {
                    if (res.json() === 0) {
                        this.restaurant.isFavorite = false;
                    }
                    else throw new Error("Unknown return value from server: " + res.json())
                },
                err => {
                    alert("Konnte Restaurant nicht als Favorit entfernen.");
                    console.error(err);
                }
            )
        }
        // set as favorite
        else {
            this.http.put(SERVER_URL + "/api/register_favorite/" + this.restaurant.id, "", options).subscribe(
                res => {
                    if (res.json() === 0) {
                        this.restaurant.isFavorite = true;
                    }
                    else throw new Error("Unknown return value from server: " + res.json());
                },
                err => {
                    alert("Konnte Restaurant nicht als Favorit setzen.");
                    console.error(err);
                })
        }
    }

    getCartItemCount() {
        return this.cartService.getCartItemCount(this.restaurant.id);
    }


    toggleDetails(data) {
        if (data.showDetails) {
            data.showDetails = false;
            data.icon = 'ios-add-circle-outline';
        } else {
            data.showDetails = true;
            data.icon = 'ios-remove-circle-outline';
        }
    }

    public toggleGroup(group) {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        } else {
            this.shownGroup = group;
        }
    }

    isGroupShown(group) {
        return this.shownGroup === group;
    }

    public goToCheckout() {
        this.navCtrl.push(OrderDetailsPage, {
            restaurant: this.restaurant
        });
    }
}

