import {Component} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {CartService} from "../../services/CartService";
import {Offer} from "../../model/Offer";

@Component({
    selector: 'order-details',
    templateUrl: 'order-details.html'
})
export class OrderDetailsPage {
    public reservation: {
        totalPrice?: number,
        items: Offer[],
        donation: number
    };


    constructor(
        private http: Http,
        navParams: NavParams,
        private toastCtrl: ToastController,
        private navCtrl: NavController,
        private cartService: CartService
    ) {
        this.reservation = {
            items: cartService.getCart(navParams.get("restaurant_id")),
            donation: 0
        };
        this.reservation.totalPrice = this.reservation.items
            .map(offer => offer.price)
            .reduce((prevPrice: number, price: number) => {
                return prevPrice + price
            });
    }

    incrementDonation() {
        let newTotalPrice = Math.ceil(this.reservation.totalPrice * 10 + 0.1) / 10;
        this.reservation.donation = parseFloat((this.reservation.donation + (newTotalPrice - this.reservation.totalPrice)).toPrecision(2));
        this.reservation.totalPrice = newTotalPrice;
    }

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

    sendOrder() {
      let user = window.localStorage.getItem("userName");
      let token = window.localStorage.getItem(user);
      let headers = new Headers({
        'Content-Type': 'application/json',
        "Authorization": "Basic " +token
        });
        let options = new RequestOptions({ headers: headers });

        this.http.post(SERVER_URL+"/api/register_reservation", JSON.stringify(this.reservation), options).subscribe(
            (res) => {
                const toast = this.toastCtrl.create({
                    message: "Bestellung wurde an Restaurant übermittelt. Sie erhalten eine Bestätigung.",
                    duration: 3000
                });
                toast.present();
                this.navCtrl.popToRoot();
            }, (err) => {
                console.error(err)
            })
    }
}
