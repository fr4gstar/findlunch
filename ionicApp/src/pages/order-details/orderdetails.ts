import {Component} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {CartService} from "../../services/CartService";
import {Offer} from "../../model/Offer";
import {AuthService} from "../../providers/auth-service";

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
    public amount: number;

    constructor(
        private http: Http,
        navParams: NavParams,
        private toastCtrl: ToastController,
        private navCtrl: NavController,
        private cartService: CartService,
        private auth: AuthService
    ) {
        this.reservation = {
            items: cartService.getCart(navParams.get("restaurant_id")),
            donation: 0
        };
        this.amount = 1;
        this.calcTotalPrice();
    }

    calcTotalPrice(){
      this.reservation.totalPrice = this.reservation.items
        .map(offer => offer.price)
        .reduce((prevPrice: number, price: number) => {
          return (prevPrice + price) * this.amount
        });
    }

    incrAmount(event, offer){
      if(this.amount === 999){
        console.log("Maxmimum amount of Product reached");
      }else{
        this.amount ++;
        offer.amount ++;
        this.calcTotalPrice();
        let idItem = this.reservation
          .items
          .find( (item, i) => {
            item.amount = offer.amount;
            return item.id === offer.id;
          })
      }
    }

    decreaseAmount(event, offer){
      if(this.amount === 1){
        this.reservation.items = this.reservation
          .items
          .splice(this.findItemIndex(offer) ,1)
        this.calcTotalPrice();
      }else {
        this.amount --;
        offer.amount --;
        this.calcTotalPrice();
      }
    }

    findItemIndex(offer){
      return this.reservation
        .items
        .findIndex( (item, i) => {
          return item.id === offer.id;
        })
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
      let user = window.localStorage.getItem("username");
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
