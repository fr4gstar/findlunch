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
        items: Offer[]
    };
    public amount: number;

    constructor(
        private http: Http,
        navParams: NavParams,
        private toastCtrl: ToastController,
        private navCtrl: NavController,
        private cartService: CartService
    ) {
        this.reservation = {
            items: cartService.getCart(navParams.get("restaurant_id"))
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

    sendOrder() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": "Basic aW9uaWNAaW9uaWMuY29tOiExMjM0NTY3OE5p"
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
