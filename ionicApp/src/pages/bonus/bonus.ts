import {Component, OnInit} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {Headers, Http, RequestOptions, RequestMethod} from "@angular/http";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {SERVER_URL} from "../../app/app.module";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {OffersPage} from "../offers/offers";

//export const FL_NAVPARAM_OFFER_ID = "offer_id";

@Component({
    selector: 'bonus',
    templateUrl: 'bonus.html'
})

export class BonusPage implements OnInit {

  public points: Object[];

    constructor(private barcodeScanner: BarcodeScanner, private toastCtrl: ToastController, navParams: NavParams, private http: Http, private navCtrl: NavController) {
    }

    ngOnInit() {
      let user = window.localStorage.getItem("userName");
      let token = window.localStorage.getItem(user);
      let headers = new Headers({
        'Content-Type': 'application/json',
        "Authorization": "Basic " +token
      });

      let options = new RequestOptions({
        headers: headers,
        method: RequestMethod.Get
      });

        this.http.get(`${SERVER_URL}/api/get_points`, options)
         .subscribe(
         res => this.points =
          //console.log(
           res.json()
         //)
          ,
         err => console.error(err)
         )
    }

    onQRClicked(event) {
      let headers = new Headers({
        'Content-Type': 'application/json',
        "Authorization": "Basic aW9uaWNAaW9uaWMuY29tOiExMjM0NTY3OE5p"
      });

      let options = new RequestOptions({
        headers: headers,
        method: RequestMethod.Put
      });
      this.barcodeScanner.scan()
        .then((barcodeData) => {
          this.http.get(`${SERVER_URL}/api/confirm_reservation/`+barcodeData.text, options)
            .subscribe(
              (res) => {
                console.log("res: " + res.json());
                let msg;
                switch (res.json()){
                  case 0:
                    msg = "Bestellung erfolgreich bestätigt!"
                    break;
                  case 3:
                    msg = "Fehler: Restaurant nicht gefunden!"
                    break;
                  case 4:
                    msg = "Fehler: Offer nicht gefunden!"
                    break;
                }
                console.log("Msg: " + msg);
                const toast = this.toastCtrl.create({
                  message: msg,
                  duration: 3000
                });
                toast.present();
              },
              (err) => {
                const toast = this.toastCtrl.create({
                  message: "Fehler: Verbindung zum Server",
                  duration: 3000
                });
                toast.present();
              }
            )
        }, (err) => {
          const toast = this.toastCtrl.create({
            message: "QR-Code Scan Fehler",
            duration: 3000
          });
          toast.present();
        });
      }

    showOffers(restaurant_id: String) {
      this.navCtrl.push(OffersPage,{restaurant_id: restaurant_id});
    }
}
