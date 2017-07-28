import {Component, OnInit} from "@angular/core";
import {Loading, NavController, NavParams, Platform} from "ionic-angular";
import {OffersService} from "./offers.service";
import {OfferProductDetailsPage} from "../offer-product-details/offer-product-details";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {Restaurant} from "../../model/Restaurant";
import {RestaurantPage} from "../restaurant/restaurant";
import {Observable} from "rxjs/Observable";
import {Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {CartService} from "../../shared/cart.service";
import {AuthService} from "../../shared/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {LoadingService} from "../../shared/loading.service";
import {Offer} from "../../model/Offer";
import {Error} from "tslint/lib/error";
import {Event} from "_debugger";
import 'rxjs/add/operator/catch';

/**
 * Page for showing the offers of a specific restaurant in a list.
 * If the user clicks on an offer, she will get to the detail view of this offer.
 * @author David Sautter, Skanny Morandi
 */
@Component({
    templateUrl: 'offers.html'
})
export class OffersPage implements OnInit {
    public restaurant: Restaurant;
    public offers: Offer[];

    // need this to be able to call a static function from the template
    public getALGsAndADDsOfOffer: Function = OffersService.getALGsAndADDsOfOffer;
    public allergenics$: Observable<string>;
    public additives$: Observable<string>;

    public categories: string[];

    private shownGroup: string = null;
    private strErrorFavorize: string;
    private strErrorDeFavorize: string;
    private strOpeningError: string;

    constructor(navParams: NavParams,
                public offerService: OffersService,
                private cartService: CartService,
                private navCtrl: NavController,
                private http: Http,
                public auth: AuthService,
                private platform: Platform,
                private loading: LoadingService,
                private translate: TranslateService) {

        this.restaurant = navParams.get("restaurant");

        // disable back-animation, because it causes problems with displaying the map on iOS
        platform.ready().then(() => {
            platform.registerBackButtonAction(() => {
                this.navCtrl.pop({animate: false});
            });
        });
    }

    public ngOnInit(): void {
        this.translate.get('Error.favorize').subscribe(
            (res: string) => {
                this.strErrorFavorize = res;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.favorize.", err);
            });
        this.translate.get('Error.deFavorize').subscribe(
            (res: string) => {
                this.strErrorDeFavorize = res;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.deFavorize.", err);
            });
        this.translate.get('Error.openingProblem').subscribe(
            (str: string) => {
                this.strOpeningError = str;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.openingProblem.", err);
            }
        );

        // retrieve the offers of this restaurant
        this.offerService.getOffers(this.restaurant.id)
            .retry(2)
            .subscribe(
                (offers: Offer[]) => {
                    this.offers = offers;
                    this.categories = Object.keys(offers);
                    this.shownGroup = this.categories[0] || null;
                },
                (err: Error) => {
                    console.error("Error retrieving offers of restaurant: ", this.restaurant, err);
                    alert(this.strOpeningError);
                    this.navCtrl.pop(); // go back so that the user can select another restaurant
                }
            );


        // get the allergenics, and additives from the server
        this.allergenics$ = this.http.get(`${SERVER_URL}/api/all_allergenic`)
            .map((res: Response) => res.json())
            .catch((err: Error) => {
                console.error("Error retrieving allergenics: ", err);
                return Observable.of("");
            });
        this.additives$ = this.http.get(`${SERVER_URL}/api/all_additives`)
            .map((res: Response) => res.json())
            .catch((err: Error) => {
                console.error("Error retrieving additives: ", err);
                return Observable.of("");
            });
    }

    /**
     * Navigates to the Product details page of the clicked menu item.
     * @param event
     *  the click
     * @param offer
     *  the clicked offer
     * @author Skanny Morandi
     */
    public onOfferClicked(event: Event, offer: Offer): void {
        this.navCtrl.push(OfferProductDetailsPage, {offer, restaurant: this.restaurant});
    }

    /**
     * Navigate to the RestaurantPage of the restaurant whos offers are shown on click
     * current restaurant Object is sent along
     * @param event
     *  the click
     * @author Skanny Morandi
     */
    public onRestaurantClicked(event: Event): void {
        this.navCtrl.push(RestaurantPage, {restaurant: this.restaurant});
    }

    /**
     * Toggles the isFavorite status of the restaurant and also sends this to the server.
     * Shows a loading animation while request is running
     * @author Skanny Morandi
     */
    public toggleIsFavorite(): void {
        // prepare loader
        const loader: Loading = this.loading.prepareLoader();
        loader.present();

        // unset as favorite if already favorite
        if (this.restaurant.isFavorite) {

            const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Delete);
            this.http.delete(`${SERVER_URL}/api/unregister_favorite/${this.restaurant.id}`, options)
                .retry(2)
                .subscribe(
                    (res: Response) => {
                        if (res.json() === 0) {
                            this.restaurant.isFavorite = false;
                            loader.dismiss();
                        } else {
                            // TODO change to alert and log
                            throw new Error(`Unknown return value from server: ${res.json()}`);
                        }
                    },
                    (err: Error) => {
                        loader.dismiss();
                        console.error(err);
                        alert(this.strErrorDeFavorize);
                    });
            // if not yet set as favorite, set it
        } else {
            const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Put);
            this.http.put(`${SERVER_URL}/api/register_favorite/${this.restaurant.id}`, "", options)
                .retry(2)
                .subscribe(
                    (res: Response) => {
                        if (res.json() === 0) {
                            this.restaurant.isFavorite = true;
                            loader.dismiss();
                        } else {
                            // TODO change to alert and log
                            throw new Error(`Unknown return value from server: ${res.json()}`);
                        }
                    },
                    (err: Error) => {
                        loader.dismiss();
                        console.error(err);
                        alert(this.strErrorFavorize);
                    });
        }
    }

    /**
     * Gets the number of items in the cart for the cartsymbol badge
     * @returns {number} number of items in current cart for chosen restaurant
     */
    public getCartItemCount(): number {
        return this.cartService.getCartItemCount(this.restaurant.id);
    }

    // TODO toggleGroupDetails
    /**
     * Toggles a food category on click and shows the food items in it
     * @param group {string}
     *  according food category
     */
    private toggleGroup(group: string): void {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        } else {
            this.shownGroup = group;
        }
    }

    /**
     * Returns whether the items of a food category are to be shown or hidden
     * by being collapsed
     * @param group {string}
     *  the according food category
     * @returns {boolean}
     *  boolean whether items are to be shown or not.
     */
    private isGroupShown(group: string): boolean {
        return this.shownGroup === group;
    }

    /**
     * sends user to the OrderDetails page, along with the restaurant object
     */
    private goToCheckout(): void {
        this.navCtrl.push(OrderDetailsPage, {
            restaurant: this.restaurant
        });
    }
}

