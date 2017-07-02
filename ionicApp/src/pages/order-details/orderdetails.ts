import {Component} from "@angular/core";
import {Headers, Http, RequestOptions, RequestMethod} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {AlertController, NavController, NavParams, ToastController} from "ionic-angular";
import {CartService} from "../../services/CartService";
import {Offer} from "../../model/Offer";
import {AuthService} from "../../providers/auth-service";
import {Restaurant} from "../../model/Restaurant";
import {DatePicker} from "@ionic-native/date-picker";
import {LoginPage} from "../login/login";
import {RegistryPage} from "../registry/registry";
import {Reservation} from "../../model/Reservation";
import {HomePage} from "../home/home";


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
    public payWithPoints;

    public openingTime;
    public closingTime;
    public nowOpen;


    constructor(private http: Http,
                navParams: NavParams,
                private toastCtrl: ToastController,
                private navCtrl: NavController,
                private cartService: CartService,
                private auth: AuthService,
                private alertCtrl: AlertController,
                private datePicker: DatePicker
)
    {
        this.restaurant = navParams.get("restaurant");
        //TODO: ftr_reservation
        this.reservation = {
            id:0,
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
        if(this.auth.getLoggedIn()){
            this.calcNeededPoints();
            this.getUserPoints();

        }

        this.nowOpen = true; //  this.restaurant.currentlyOpen;

        this.calcTimings(5);
    }

    /**
     * Increases the amount of one given offer. Also checks for the max-limit.
     * Points needed to "pay with points" for entire order gets recalculated.
     * The donation is reset if this method gets executed.
     * @param offer
     */
    incrAmount(offer) {
        if (offer.amount >= 999) {
            console.log("Maxmimum amount of Product reached");
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
     * Sends the current order to the server. This requires authentication.
     */
   sendOrder() {
        if(this.reservation.items.length === 0){
            alert("Sie können keine leere Bestellung absenden.");
        } else{

            let user = window.localStorage.getItem("username");
            let token = window.localStorage.getItem(user);
            let headers = new Headers({
                'Content-Type': 'application/json',
                "Authorization": "Basic " + token
            });
            let options = new RequestOptions({headers: headers});

                this.reservation.collectTime = Date.parse(this.pickUpTimeISOFormat);

            if(this.auth.getLoggedIn()){
                this.reservation.usedPoints = this.payWithPoints;
                if (this.reservation.usedPoints){
                    this.reservation.pointsCollected = false;
                }
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

            this.http.post(SERVER_URL + "/api/register_reservation", JSON.stringify(payload), options).subscribe(
                (res) => {
                    const toast = this.toastCtrl.create({
                        message: "Bestellung wurde an Restaurant übermittelt. Sie erhalten eine Bestätigung.",
                        duration: 3000
                    });
                    toast.present();

                    // empty the cart for this restaurant
                    this.cartService.emptyCart(this.restaurant.id);

                    // go back to restaurants-overview
                    this.navCtrl.popTo(HomePage);
                }, (err) => {
                    console.error(err)
                })
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
    public showDonationInfo(){
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Wenn Ihnen die App FindLunch gefällt, können Sie uns hier mit dieser Spende unterstützen. Die Spende " +
        "wird als Ausgangseinstellung so gewählt, dass sie auf die nächsten vollen 10 Cent vom" +
          "Betrag Ihrer Bestellung rundet. Diese können Sie aber nach Belieben anpassen.",
        buttons: ['Ok']
      });
      alert.present();
  }

  /**
   * Lets the user enter his desired pickup time.
   * /TODO: Only valid times should be able to be chosen.
   */


  /**
   * Sends the user to the Loginpage. After successful Login he is automatically
   * coming back to this order-details-page
   */
  public goToLogin(){
    this.navCtrl.push(LoginPage, {comeBack: true});
  }

  /**
   * Sends the user to the Registry. After successful Registry and
   * involved Login he is automatically coming back to this order-details-page
   */
  public goToRegister(){
    this.navCtrl.push(RegistryPage, {comeBack: true});
  }

    /**
     * Gets the Points of the user for the particular restaurant
     * Sets the information whether its possible to pay the order with points
     */
    public getUserPoints(){
        let user = window.localStorage.getItem("username");
        let token = window.localStorage.getItem(user);
        let headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": "Basic " + token
        });
        let options = new RequestOptions({headers: headers,
                                method: RequestMethod.Get});
        this.http.get(`${SERVER_URL}/api/get_points_restaurant/` + this.restaurant.id, options)
            .subscribe(
                res =>{
                    let reply = res.json();
                    this.userPoints= reply[0].points;
                    // boolean whether enough points to pay order with points
                    // has to wait for the getUserPoints query
                    this.morePointsThanNeeded = this.userPoints > this.neededPoints;

                },
                err => console.error(err)
            )}

    public calcNeededPoints(){
        let totalNeededPoints = 0;
        for(let item of this.reservation.items){
            totalNeededPoints += (item.neededPoints * item.amount);
        }
        this.neededPoints = totalNeededPoints;
    }

    public hasEnoughPoints(){
        this.morePointsThanNeeded = this.userPoints > this.neededPoints;
    }

    public calcTimings(prepTime) {
        let date = new Date();
        // restaurant.timeSchedules is an Array with of Objects with opening times for single
        // days in the order of weekdays e.g. timeSchedules[0] are opening times on Monday
        let day = date.getDay();
        if(day === 0){
            day = 1;
        } else{
            day = day-1;

        }
        this.closingTime = this.restaurant.timeSchedules[day]["openingTimes"][0].closingTime.split(" ")[1];
        this.openingTime = this.restaurant.timeSchedules[day]["openingTimes"][0].openingTime.split(" ")[1];


        let prepTimeInMs = prepTime * 60 * 1000 + 120 * 60 * 1000; //= +2hrs difference from UTC time
        date.setTime(date.getTime() + prepTimeInMs);

        this.pickUpTime = date;
        this.pickUpTimeISOFormat = date.toISOString();
    }

}
