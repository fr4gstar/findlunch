import {Component} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {NavController, NavParams, ToastController} from "ionic-angular";

@Component({
    selector: 'order-details',
    templateUrl: 'order-details.html'
})
export class OrderDetailsPage {
    public reservation: {
        amount: number,
        totalPrice: number,
        offer: any
    };


    constructor(private http: Http, navParams: NavParams, private toastCtrl: ToastController, private navCtrl: NavController) {
        this.reservation = {
            amount: 1,
            totalPrice: navParams.get("offer").price,
            offer: navParams.get("offer")
        };
    }

    updateTotalPrice() {
        this.reservation.totalPrice = this.reservation.offer.price * this.reservation.amount;
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
