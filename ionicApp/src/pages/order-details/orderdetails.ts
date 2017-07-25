import {Component} from "@angular/core";
import {Headers, Http, RequestMethod, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {AlertController, NavController, NavParams, ToastController} from "ionic-angular";
import {CartService} from "../../services/CartService";
import {Offer} from "../../model/Offer";
import {AuthService} from "../../providers/auth-service";
import {Restaurant} from "../../model/Restaurant";
import {LoginPage} from "../login/login";
import {RegistryPage} from "../registry/registry";
import {Reservation} from "../../model/Reservation";

import {LoadingService} from "../../providers/loading-service";
import {TranslateService} from "@ngx-translate/core";


/**
 * Page for showing an overview of the cart and the amount of items in it.
 * It calculates and shows the total price to pay and provides a way to donate.
 */
@Component({
    selector: 'order-details',
    templateUrl: 'order-details.html'
})
export class OrderDetailsPage {
    public reservation: Reservation;
    public restaurant: Restaurant;
    public pickUpTime;
    public pickUpTimeISOFormat;


    public userPoints = 0;
    public neededPoints = 0;
    public morePointsThanNeeded;
    public payWithPoints = false;

    public openingTime;
    public closingTime;
    public nowOpen;
    public now;
    public earliestPickUp;
    private param;

    private donationInfo;
    private info;
    private successOrder;
    private emptyOrder;

    constructor(private http: Http,
                navParams: NavParams,
                private toastCtrl: ToastController,
                private navCtrl: NavController,
                private cartService: CartService,
                private auth: AuthService,
                private alertCtrl: AlertController,
                private loading: LoadingService,
                private translate: TranslateService) {
        translate.setDefaultLang('de');
        this.translate.get('Error.emptyOrder').subscribe(
            value => {
                this.emptyOrder = value
            }
        )
        this.translate.get('Success.order').subscribe(
            value => {
                this.successOrder = value
            }
        )
        this.translate.get('info').subscribe(
            value => {
                this.info = value
            }
        )
        this.translate.get('donationInfo').subscribe(
            value => {
                this.donationInfo = value
            }
        )

        this.restaurant = navParams.get("restaurant");

        this.reservation = {
            id: 0,
            donation: 0,
            totalPrice: 0,
            usedPoints: false,
            pointsCollected: true,
            points: 0,
            reservationNumber: 0,
            items: cartService.getCart(this.restaurant.id),
            restaurant: this.restaurant,
            bill: null,
            reservationStatus: null,
            collectTime: null,
        };

        this.reservation.totalPrice = this.calcTotalPrice(this.reservation.items);
        if (this.auth.getLoggedIn()) {
            this.calcNeededPoints();
            this.getUserPoints();
        }

        this.nowOpen = this.restaurant.currentlyOpen;

        this.calcTimings(10);

    }

    /**
     * Increases the amount of one given offer. Also checks for the max-limit.
     * Points needed to "pay with points" for entire order gets recalculated.
     * The donation is reset if this method gets executed.
     * @param offer
     */
    incrAmount(offer) {
        if (offer.amount >= 999) {
            console.info("Maxmimum amount of Product reached");
        } else {
            offer.amount++;
            this.reservation.totalPrice = this.calcTotalPrice(this.reservation.items);
            this.reservation.donation = 0;
            this.calcNeededPoints();
            this.hasEnoughPoints();


        }
    }

    /**
     * Decreases the amount of one given offer. Removes item from orders if amount will be 0.
     * Points needed to "pay with points" for entire order gets recalculated.
     * The donation is reset if this method gets executed.
     * @param offer
     */
    decreaseAmount(offer) {
        if (offer.amount <= 1) {
            this.reservation.items.splice(this.findItemIndex(offer), 1);
        } else {
            offer.amount--;
        }
        this.reservation.totalPrice = this.calcTotalPrice(this.reservation.items);
        this.reservation.donation = 0;
        this.calcNeededPoints();
        this.hasEnoughPoints();


    }

    /**
     * Raises the donation by the following rules:
     *  - increase to next 10 Cents (1,12 -> 1,20)
     *  - then increase by 10 Cents (1,20 -> 1,30)
     */
    incrementDonation() {
        let newTotalPrice = Math.ceil(this.reservation.totalPrice * 10 + 0.1) / 10;
        this.reservation.donation = parseFloat((this.reservation.donation + (newTotalPrice - this.reservation.totalPrice)).toPrecision(2));
        this.reservation.totalPrice = newTotalPrice;
    }

    /**
     * Decreases the donation by the following rules:
     *  - if donation >= 10 Cents, decrease by 10 Cents
     *  - else decrease to the total price of the items (no donation)
     */
    decrementDonation() {
        let newTotalPrice, donation;
        if (this.reservation.donation > 0.10) {
            newTotalPrice = Math.floor(this.reservation.totalPrice * 10 - 0.1) / 10;
            donation = parseFloat((this.reservation.donation + (newTotalPrice - this.reservation.totalPrice)).toPrecision(2));
        }
        else {
            newTotalPrice = this.reservation.totalPrice - this.reservation.donation;
            donation = 0;
        }
        this.reservation.donation = donation;
        this.reservation.totalPrice = newTotalPrice;

    }

    /**
     * Sends the current order to the server. While request is running, loading-animation active.
     *
     */
    sendOrder() {
        if (this.reservation.items.length === 0) {
            alert(this.emptyOrder);
        } else {
            let loader = this.loading.prepareLoader();

            //starts the loading spinner
            loader.present().then(res => {

                this.reservation.collectTime = Date.parse(this.pickUpTimeISOFormat);

                if (this.auth.getLoggedIn()) {
                    this.reservation.usedPoints = this.payWithPoints;
                    this.reservation.pointsCollected = !this.reservation.usedPoints;

                    this.reservation.points = this.neededPoints;
                }

                let payload = {
                    ...this.reservation,
                    reservation_offers: []
                };
                payload.items.forEach((item) => {
                    payload.reservation_offers.push({
                        offer: {
                            id: item.id
                        },
                        amount: item.amount
                    });
                });
                delete payload.items;

                //prepare RequestOptions for http-call
                let options = this.auth.prepareHttpOptions(RequestMethod.Post);

                this.http.post(SERVER_URL + "/api/register_reservation", JSON.stringify(payload), options).subscribe(
                    (res) => {
                        const toast = this.toastCtrl.create({
                            message: this.successOrder,
                            duration: 3000
                        });
                        toast.present();

                        // empty the cart for this restaurant
                        this.cartService.emptyCart(this.restaurant.id);

                        // go back to restaurants-overview
                        this.navCtrl.popToRoot();
                        //stops the spinner
                        loader.dismiss();
                    }, (err) => {
                        console.error(err);
                        //stop the spinner
                        loader.dismiss();

                    })
            });
        }
    }


    /**
     * Calculates the total price of a given Array of Offer-items.
     * @param items
     * @returns {number} the total price of all items respecting their amounts.
     */
    private calcTotalPrice(items: Offer[]) {
        return this.reservation.items
            .map(offer => offer.price * offer.amount)
            .reduce((prevOfferSum, offerSum) => prevOfferSum + offerSum, 0);
    }

    /**
     * Finds the index of this offer in the items-array of the reservation.
     * @param offer
     * @returns {number}
     */
    private findItemIndex(offer) {
        return this.reservation.items
            .findIndex((item, i) => item.id === offer.id)
    }

    /**
     * Shows explanation alert for donation option in the view
     */
    public showDonationInfo() {
        let alert = this.alertCtrl.create({
            title: this.info,
            subTitle: this.donationInfo,
            buttons: ['Ok']
        });
        alert.present();
    }

    /**
     * Sends the user to the Loginpage. After successful Login he is automatically
     * coming back to this order-details-page.
     */
    public goToLogin() {
        this.navCtrl.push(LoginPage, {comeBack: true, restaurant: this.restaurant});
    }

    /**
     * Sends the user to the Registry. After successful Registry and
     * involved Login he is automatically coming back to this order-details-page
     */
    public goToRegister() {
        this.navCtrl.push(RegistryPage, {comeBack: true, restaurant: this.restaurant});
    }

    /**
     * Gets the Points of the user for the particular restaurant
     * Sets the information whether its possible to pay the order with points
     */
    public getUserPoints() {

        //start loading animation
        let loader = this.loading.prepareLoader();
        loader.present().then(res => {

            //prepare RequestOptions
            let options = this.auth.prepareHttpOptions(RequestMethod.Get);

            this.http.get(`${SERVER_URL}/api/get_points_restaurant/` + this.restaurant.id, options)
                .subscribe(
                    res => {
                        let reply = res.json();
                        //if user has no points at the restaurant yet
                        if (!(reply.length === 0)) {
                            this.userPoints = reply[0].points;
                        }
                        // set param for html
                        this.param = {
                            name: this.restaurant.name,
                            points: this.userPoints,
                            nPoints: this.neededPoints
                        };
                        // boolean whether enough points to pay order with points
                        // has to wait for the getUserPoints query
                        this.morePointsThanNeeded = this.userPoints > this.neededPoints;

                    },
                    err => {
                        console.error(err);

                    })
            loader.dismiss();
        })
    }

    public calcNeededPoints() {
        let totalNeededPoints = 0;
        for (let item of this.reservation.items) {
            totalNeededPoints += (item.neededPoints * item.amount);
        }
        this.neededPoints = totalNeededPoints;
    }

    public hasEnoughPoints() {
        this.morePointsThanNeeded = this.userPoints > this.neededPoints;
    }

    public calcTimings(prepTime) {
        let date = new Date();
        // restaurant.timeSchedules is an Array with of Objects with opening times for single
        // days in the order of weekdays e.g. timeSchedules[0] are opening times on Monday
        let day = date.getDay();
        if (day === 0) {
            day = 1;
        } else {
            day = day - 1;

        }
        this.closingTime = this.restaurant.timeSchedules[day]["openingTimes"][0].closingTime.split(" ")[1];
        this.openingTime = this.restaurant.timeSchedules[day]["openingTimes"][0].openingTime.split(" ")[1];


        let prepTimeInMs = prepTime * 60 * 1000 + 120 * 60 * 1000; //= +2hrs difference from UTC time
        date.setTime(date.getTime() + prepTimeInMs);

        this.pickUpTime = date;
        this.pickUpTimeISOFormat = date.toISOString();

        date.setTime(date.getTime() - 120 * 60 * 1000);
        this.earliestPickUp = date.toLocaleTimeString()

    }

}
