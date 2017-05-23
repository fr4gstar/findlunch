import {Component, OnInit} from "@angular/core";
import {NavController, NavParams, ViewController} from "ionic-angular";
import {Headers, Http, RequestOptions, RequestMethod} from "@angular/http";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {SERVER_URL} from "../../app/app.module";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

//export const FL_NAVPARAM_OFFER_ID = "offer_id";

@Component({
    selector: 'bonus',
    templateUrl: 'bonus.html'
})

export class BonusPage implements OnInit {

  public points: Object[];

    constructor(private barcodeScanner: BarcodeScanner, navParams: NavParams, private http: Http, private navCtrl: NavController) {


    }

    ngOnInit() {
      let headers = new Headers({
        'Content-Type': 'application/json',
        "Authorization": "Basic aW9uaWNAaW9uaWMuY29tOiExMjM0NTY3OE5p"
      });

      let options = new RequestOptions({
        headers: headers,
        method: RequestMethod.Put
      });

        this.http.get(`${SERVER_URL}/api/get_points`, options)
         .subscribe(
         res => this.points = res.json(),
         err => console.error(err)
         )
    }

    public onQRClicked(event){
      let headers = new Headers({
        'Content-Type': 'application/json',
        "Authorization": "Basic aW9uaWNAaW9uaWMuY29tOiExMjM0NTY3OE5p"
      });

      let options = new RequestOptions({
        headers: headers,
        method: RequestMethod.Put
      });

      console.log("Barcode scan started");
      this.barcodeScanner.scan()
        .then((barcodeData) => {
          console.log(barcodeData);
          this.http.get(`${SERVER_URL}/api/confirm_reservation/`+barcodeData.text, options)
            .subscribe(
              res => console.log(res.json()),
              err => console.error(err)
            )
        // Success! Barcode data is here
        }, (err) => {
        // An error occurred
        });
      }

}
