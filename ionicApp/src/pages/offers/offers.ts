import {Component, OnInit} from "@angular/core";
import {NavController, NavParams, Platform} from "ionic-angular";
import {OffersService} from "./offers.service";
import {OffersProductPage} from "../offers-product-view/offers-product-view";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {Restaurant} from "../../model/Restaurant";
import {RestaurantViewPage} from "../restaurant-view/restaurant-view";
import {Observable} from "rxjs/Observable";
import {Http, RequestMethod} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {CartService} from "../../shared/cart.service";
import {AuthService} from "../../shared/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {LoadingService} from "../../shared/loading.service";


/**
 * Page for showing the offers of a specific restaurant in a list.
 * If the user clicks on an offer, she will get to the detail view of this offer.
 * @author David Sautter
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

    private errorFavorize;
    private errorDeFavorize;

    constructor(navParams: NavParams,
                public offerService: OffersService,
                private cartService: CartService,
                private navCtrl: NavController,
                private http: Http,
                public auth: AuthService,
                private platform: Platform,
                private loading: LoadingService,
                private translate: TranslateService) {
        //TODO: transfer translate to onInit
        translate.setDefaultLang('de');
        this.translate.get('Error.favorize').subscribe(
            (res: string) => {
                this.errorFavorize = res
            }
        )
        this.translate.get('Error.deFavorize').subscribe(
            (res: string) => {
                this.errorDeFavorize = res
            }
        )

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

    /**
     * //TODO: write comment
     * @param event
     * @param offer
     */
    public onOfferClicked(event, offer) {
        this.navCtrl.push(OffersProductPage, {offer, restaurant: this.restaurant})
    }

    /**
     * //TODO write comment
     * @param event
     */
    public onRestaurantClicked(event) {
        this.navCtrl.push(RestaurantViewPage, {restaurant: this.restaurant})
    }

    /**
     * Toggles the isFavorite status of the restaurant and also sends this to the server.
     * @author Skanny Morandi
     */
    public toggleIsFavourite() {

        let loader = this.loading.prepareLoader();
        loader.present();
        // unset as favorite
        if (this.restaurant.isFavorite) {

            let options = this.auth.prepareHttpOptions(RequestMethod.Delete);
            this.http.delete(SERVER_URL + "/api/unregister_favorite/" + this.restaurant.id, options)
                .retry(2)
                .subscribe(
                res => {
                    if (res.json() === 0) {
                        this.restaurant.isFavorite = false;
                        loader.dismiss();


                    }
                    else throw new Error("Unknown return value from server: " + res.json())
                },
                err => {
                    alert(this.errorDeFavorize);
                    loader.dismiss();
                    console.error(err);
                    //TO
                }
            )
        }
        // set as favorite
        else {
            let options = this.auth.prepareHttpOptions(RequestMethod.Put);
            this.http.put(SERVER_URL + "/api/register_favorite/" + this.restaurant.id, "", options)
                .retry(2)
                .subscribe(
                res => {
                    if (res.json() === 0) {
                        this.restaurant.isFavorite = true;
                        loader.dismiss();

                    }
                    else throw new Error("Unknown return value from server: " + res.json());
                },
                err => {
                    alert(this.errorFavorize);
                    loader.dismiss();
                    console.error(err);
                })
        }
    }

    /**
     * gets the number in the cartsymbol badge
     *
     * @returns {number}
     * number of items in current cart for chosen restaurant
     */
    getCartItemCount() {
        return this.cartService.getCartItemCount(this.restaurant.id);
    }

    /**
     * //TODO: Comment schreiben
     */
    toggleDetails(data) {
        if (data.showDetails) {
            data.showDetails = false;
            data.icon = 'ios-add-circle-outline';
        } else {
            data.showDetails = true;
            data.icon = 'ios-remove-circle-outline';
        }
    }

    /**
     * //TODO: Comment schreiben
     * @param group
     */
    public toggleGroup(group) {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        } else {
            this.shownGroup = group;
        }
    }

    /**
     * //TODO: Comment schreiben
     * @param group
     * @returns {boolean}
     */
    isGroupShown(group) {
        return this.shownGroup === group;
    }

    /**
     * sends user to the OrderDetails page, along with the restaurant object
     */
    public goToCheckout() {
        this.navCtrl.push(OrderDetailsPage, {
            restaurant: this.restaurant
        });
    }
}

