import {Component} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {AlertController, NavController, NavParams, ToastController} from "ionic-angular";
import {CartService} from "../../services/CartService";
import {Offer} from "../../model/Offer";
import {AuthService} from "../../providers/auth-service";
import {Restaurant} from "../../model/Restaurant";
import {DatePicker} from "@ionic-native/date-picker";
import {LoginPage} from "../login/login";


/**
 * Page for showing an overview of the cart and the amount of items in it.
 * It calculates and shows the total price to pay and provides a way to donate.
 */
@Component({
    selector: 'order-details',
    templateUrl: 'order-details.html'
})
export class OrderDetailsPage {
    public reservation: {
        totalPrice: number,
        items: Offer[],
        donation: number,
        usedPoints: number,
        collectTime: number
    };
    public restaurant: Restaurant;
    public pickUpTime;

    public morePointsThanNeeded = true; //TODO: Info auslesen lassen

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
        this.reservation = {
            items: cartService.getCart(this.restaurant.id),
            donation: 0,
            usedPoints: 0,
            totalPrice: 0,
            collectTime: Date.now() + 1000 * 60 * 5     // 5 min in future
        };
        this.reservation.totalPrice = this.calcTotalPrice(this.reservation.items);
        this.pickUpTime = new Date().getTime().toString();
    }

    /**
     * Increases the amount of one given offer. Also checks for the max-limit.
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
        }
    }

    /**
     * Decreases the amount of one given offer. Removes item from orders if amount will be 0.
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
        let user = window.localStorage.getItem("username");
        let token = window.localStorage.getItem(user);
        let headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": "Basic " + token
        });
        let options = new RequestOptions({headers: headers});

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
                this.navCtrl.popToRoot();
            }, (err) => {
                console.error(err)
            })
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
  public enterPickUpTime(){
    this.datePicker.show({
      date: new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(

      date => {
        console.log('Got date: ', date)
        this.pickUpTime = date;
      },
          err => console.log('Error occurred while getting date: ', err)
    );
  }

  public goToLogin(){
    this.navCtrl.push(LoginPage, {comeBack: true});
  }

}
