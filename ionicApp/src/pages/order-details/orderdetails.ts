import {Component, OnInit} from "@angular/core";
import {Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {Alert, AlertController, Loading, NavController, NavParams, Toast, ToastController} from "ionic-angular";
import {CartService} from "../../shared/cart.service";
import {Offer} from "../../model/Offer";
import {AuthService} from "../../shared/auth.service";
import {Restaurant} from "../../model/Restaurant";
import {LoginPage} from "../login/login";
import {RegistryPage} from "../registry/registry";
import {Reservation} from "../../model/Reservation";
import {LoadingService} from "../../shared/loading.service";
import {TranslateService} from "@ngx-translate/core";

/**
 * Page for showing an overview of the cart and the amount of items in it.
 * It calculates and shows the total price to pay and provides a way to donate.
 * @author Skanny Morandi, David Sautter
 */
@Component({
    templateUrl: 'order-details.html'
})
export class OrderDetailsPage implements OnInit {

    public reservation: Reservation;
    public restaurant: Restaurant;
    public pickUpTime: Date;
    public pickUpTimeISOFormat: string; //Date in Stringformat for backend.
    public userPoints: number = 0;
    public neededPoints: number = 0; //points needed to pay the current order with points
    public morePointsThanNeeded: boolean; //user's points are more than is needed to pay with points
    public payWithPoints: boolean = false;

    public openingTime: string; //of today the current restaurant
    public closingTime: string; //of today the current restaurant
    public earliestPickUp: string;
    public nowOpen: boolean;
    private strDonationInfo: string;
    private strInfo: string;
    private strSuccessOrder: string;
    private strFailOrder: string;
    private strEmptyOrder: string;
    private strFailedLoadPoints: string;
    private strOpeningProblem: string;

    private param: Object;

    constructor(private http: Http,
                navParams: NavParams,
                private toastCtrl: ToastController,
                private navCtrl: NavController,
                private cartService: CartService,
                private auth: AuthService,
                private alertCtrl: AlertController,
                private loading: LoadingService,
                private translate: TranslateService) {
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
            collectTime: null
        };

        this.reservation.totalPrice = OrderDetailsPage.calcTotalPrice(this.reservation.items);
        if (this.auth.getLoggedIn()) {
            // in order to determine whether the option of "paying with points" is activated or not
            // these pieces of information have to be provided
            this.calcNeededPoints();
            this.getUserPoints();
        }

        this.nowOpen = this.restaurant.currentlyOpen;
        // sets the earliest settable time in the datepicker to 10 minutes from now.
        this.calcTimings(10);

    }

    /**
     * Calculates the total price of a given Array of Offer-items.
     * @param items
     * @returns {number} the total price of all items respecting their amounts.
     *
     * @author David Sautter
     */
    private static calcTotalPrice(items: Offer[]): number {
        return items
            .map((offer: Offer) => offer.price * offer.amount)
            .reduce((prevOfferSum: number, offerSum: number) => prevOfferSum + offerSum, 0);
    }


    public ngOnInit(): void {
        this.translate.get('Error.emptyOrder').subscribe(
            (value: string) => {
                this.strEmptyOrder = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.emptyOrder.", err);
            }
        );
        this.translate.get('Success.order').subscribe(
            (value: string) => {
                this.strSuccessOrder = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Success.order.", err);
            }
        );
        this.translate.get('info').subscribe(
            (value: string) => {
                this.strInfo = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key info.", err);
            }
        );
        this.translate.get('donationInfo').subscribe(
            (value: string) => {
                this.strDonationInfo = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key donationInfo.", err);
            }
        );
        this.translate.get('Error.failedOrder').subscribe(
            (value: string) => {
                this.strFailOrder = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.failedOrder", err);
            }
        );
        this.translate.get('Error.failedLoadPoints').subscribe(
            (value: string) => {
                this.strFailedLoadPoints = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.failedLoadPoints", err);
            }
        );
        this.translate.get('Error.openingProblem').subscribe(
            (value: string) => {
                this.strOpeningProblem = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.openingProblem", err);
            }
        );
    }

    /**
     * Increases the amount of one given offer. Also checks for the max-limit.
     * Points needed to "pay with points" for entire order gets recalculated.
     * The donation is reset if this method gets executed.
     * @param offer
     */
    public incrAmount(offer: Offer): void {
        if (offer.amount >= 999) {
            console.warn("Maxmimum amount of Product reached");
        } else {
            offer.amount++;
            this.reservation.totalPrice = OrderDetailsPage.calcTotalPrice(this.reservation.items);
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
    public decreaseAmount(offer: Offer): void {
        if (offer.amount <= 1) {
            this.reservation.items.splice(this.findItemIndex(offer), 1);
        } else {
            offer.amount--;
        }
        this.reservation.totalPrice = OrderDetailsPage.calcTotalPrice(this.reservation.items);
        this.reservation.donation = 0;
        this.calcNeededPoints();
        this.hasEnoughPoints();

    }


    /**
     * Raises the donation by the following rules:
     *  - increase to next 10 Cents (1,12 -> 1,20)
     *  - then increase by 10 Cents (1,20 -> 1,30)
     *
     *  @author: David Sautter
     */
    public incrementDonation(): void {
        // securing input parameters
        if (this.reservation.totalPrice === undefined || this.reservation.totalPrice === null || this.reservation.totalPrice < 0) {
            console.error(`Tried to increment Donation, but totalPrice is: ${this.reservation.totalPrice}`);
            return;
        }
        if (!this.reservation || typeof this.reservation.totalPrice !== "number" || typeof this.reservation.donation !== "number"
        ) {
            console.error("Input-Parameters not ok for incrementing a donation", this.reservation);
            return;
        }
        if (this.reservation.totalPrice < this.reservation.donation) {
            console.error(`Inconsistent state! totalPrice ${this.reservation.totalPrice} is smaller than donation ${this.reservation.donation}`);
            this.translate.get("Error.critical").subscribe((errorMsg: string) => {
                alert(errorMsg);
                this.navCtrl.popToRoot();
            });
            return;
        }
        if (this.reservation.donation < 0) {
            console.error(`donation was ${this.reservation.donation}. Resetting to 0`);
            this.reservation.donation = 0;
            return;
        }

        // do calculations
        const newTotalPrice: number = Math.ceil(this.reservation.totalPrice * 10 + 0.1) / 10;
        this.reservation.donation = parseFloat((this.reservation.donation + (newTotalPrice - this.reservation.totalPrice)).toFixed(2));
        this.reservation.totalPrice = newTotalPrice;
    }


    /**
     * Decreases the donation by the following rules:
     *  - if donation >= 10 Cents, decrease by 10 Cents
     *  - else decrease to the total price of the items (no donation)
     *
     *  @author David Sautter
     */
    public decrementDonation(): void {
        let newTotalPrice: number;
        let donation: number;

        // securing input parameters
        if (this.reservation && this.reservation.donation <= 0) {
            console.error("Tried to decrement a donation of value: ", this.reservation.donation);
            this.reservation.donation = 0;
            return;
        }
        if (!this.reservation || !this.reservation.totalPrice || !this.reservation.donation
            || typeof this.reservation.totalPrice !== "number" || typeof this.reservation.donation !== "number"
        ) {
            console.error("Input-Parameters not ok for decrementing a donation", this.reservation);
            return;
        }
        if (this.reservation.totalPrice < this.reservation.donation) {
            console.error(`Inconsistent state! totalPrice ${this.reservation.totalPrice} is smaller than donation ${this.reservation.donation}`);
            this.translate.get("Error.critical").subscribe((errorMsg: string) => {
                alert(errorMsg);
                this.navCtrl.popToRoot();
            });
            return;
        }

        // do calculations
        if (this.reservation.donation > 0.10) {
            newTotalPrice = Math.floor(this.reservation.totalPrice * 10 - 0.1) / 10;
            donation = parseFloat((this.reservation.donation + (newTotalPrice - this.reservation.totalPrice)).toFixed(2));
        } else {
            newTotalPrice = this.reservation.totalPrice - this.reservation.donation;
            donation = 0;
        }
        this.reservation.donation = donation;
        this.reservation.totalPrice = newTotalPrice;

    }


    /**
     * Sends the current order to the server.
     * While request is running, loading-animation is active.
     *
     * @author Skanny Morandi, David Sautter
     */
    public sendOrder(): void {
        //TODO check reservation -> price == negative, reservation null, donation > totalprice
        //sending an empty order is not possible
        if (this.reservation.items.length === 0) {
            alert(this.strEmptyOrder);
        } else {
            const loader: Loading = this.loading.prepareLoader();

            //starts the loading spinner
            loader.present().then(() => {
                this.reservation.collectTime = Date.parse(this.pickUpTimeISOFormat);

                //if logged in,
                if (this.auth.getLoggedIn()) {
                    this.reservation.usedPoints = this.payWithPoints;
                    this.reservation.pointsCollected = !this.reservation.usedPoints;

                    this.reservation.points = this.neededPoints;
                }
                //noinspection TsLint
                const payload: any = {
                    ...this.reservation,
                    reservation_offers: [],
                    restaurant: {
                        id: this.reservation.restaurant.id      // do only send id with request payload (faster)
                    }
                };
                payload.items.forEach((item: Offer) => {
                    payload.reservation_offers.push({
                        offer: {
                            id: item.id
                        },
                        amount: item.amount
                    });
                });
                delete payload.items;

                //prepare RequestOptions for http-call
                const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Post);

                this.http.post(`${SERVER_URL}/api/register_reservation`, JSON.stringify(payload), options)
                    .retry(2)
                    .subscribe(
                        (res: Response) => {
                            const toast: Toast = this.toastCtrl.create({
                                message: this.strSuccessOrder,
                                duration: 3000
                            });
                            toast.present();

                            // empty the cart for this restaurant
                            this.cartService.emptyCart(this.restaurant.id);

                            // go back to restaurants-overview
                            this.navCtrl.popToRoot();

                            //stop the spinner
                            loader.dismiss();
                        },
                        (err: Error) => {
                            console.error(err);
                            alert(this.strFailOrder);
                            //stop the spinner
                            loader.dismiss();

                        });
            });
        }
    }

    /**
     * Shows explanation for donation option in the view
     */
    public showDonationInfo(): void {
        const alert: Alert = this.alertCtrl.create({
            title: this.strInfo,
            subTitle: this.strDonationInfo,
            buttons: ['Ok']
        });
        alert.present();
    }

    /**
     * Sends the user to the Loginpage. After successful Login by sending along the
     * "comeBack"-boolean he is automatically coming back to this order-details-page.
     */
    public goToLogin(): void {
        this.navCtrl.push(LoginPage, {comeBack: true, restaurant: this.restaurant});
    }

    /**
     * Sends the user to the Registry. After successful Registration and
     * involved Login by sending along the "comeBack"-boolean he is
     * automatically coming back to this order-details-page.
     */
    public goToRegister(): void {
        this.navCtrl.push(RegistryPage, {comeBack: true, restaurant: this.restaurant});
    }

    /**
     * Gets the Points of the user for the particular restaurant
     * Sets the information whether its possible to pay the order with points
     */
    public getUserPoints(): void {
        //start loading animation
        const loader: Loading = this.loading.prepareLoader();
        loader.present().then(() => {
            //prepare RequestOptions
            const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Get);

            this.http.get(`${SERVER_URL}/api/get_points_restaurant/${this.restaurant.id}`, options)
                .retry(2)
                .subscribe(
                    (res: Response) => {
                        //noinspection TsLint
                        const reply: any = res.json();
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
                        loader.dismiss();

                    },
                    (err: Error) => {
                        console.error(err);
                        alert(this.strFailedLoadPoints)
                        loader.dismiss();
                    });
        });
    }

    /**
     * calculates the points that are needed to pay for the order with only points
     */
    public calcNeededPoints(): void {
        let totalNeededPoints: number = 0;
        for (const item of this.reservation.items) {
            totalNeededPoints += (item.neededPoints * item.amount);
        }
        this.neededPoints = totalNeededPoints;
    }

    /**
     * checks whether user has enough points to pay with points
     */
    public hasEnoughPoints(): void {
        this.morePointsThanNeeded = this.userPoints >= this.neededPoints;
    }

    /**
     * calculates the minimum and maximum time for the datepicker that lets the user choose his desired
     * pickuptime depending on the opening times of the restaurant on the current day
     * @param prepTime
     *  amount of time that is needed for the order to be prepared. the time of Now + the prepTime equals
     *  the lower threshold of the datepicker.
     */
    public calcTimings(prepTime: number): void {
        const date: Date = new Date();
        // restaurant.timeSchedules is an Array of Objects with opening time strings for single
        // days in the order of weekdays e.g. timeSchedules[0] are opening times on Monday

        try {
            let day: number = date.getDay();
            if (day === 0) {
                day = 1;
            } else {
                day = day - 1;

            }

            this.closingTime = this.restaurant.timeSchedules[day].openingTimes[0].closingTime.split(" ")[1];
            // TODO check needed?
            this.openingTime = this.restaurant.timeSchedules[day].openingTimes[0].openingTime.split(" ")[1];

            const prepTimeInMs: number = prepTime * 60 * 1000 + 120 * 60 * 1000; //= +2hrs difference from UTC time
            date.setTime(date.getTime() + prepTimeInMs);

            this.pickUpTime = date;
            this.pickUpTimeISOFormat = date.toISOString();

            date.setTime(date.getTime() - 120 * 60 * 1000);
            this.earliestPickUp = date.toLocaleTimeString();
        } catch (e) {
            console.error(e);
            alert(this.strOpeningProblem);
        }
    }

    /**
     * Finds the index of this offer in the items-array of the reservation.
     * @param offer
     * @returns {number}
     */
    private findItemIndex(offer: Offer): number {
        return this.reservation.items
            .findIndex((item: Offer) => item.id === offer.id);
    }

}
