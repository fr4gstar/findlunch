import {Component, OnInit} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {Headers, Http, RequestOptions, RequestMethod} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {OffersPage} from "../offers/offers";
import {QRService} from "../../providers/QRService";

@Component({
    selector: 'bonus',
    templateUrl: 'bonus.html'
})

export class BonusPage implements OnInit {

  public points: Object[];

    constructor(
      private toastCtrl: ToastController,
      navParams: NavParams,
      private http: Http,
      private navCtrl: NavController,
      private qr: QRService,) {
    }

    ngOnInit() {
      let headers = new Headers({
        'Content-Type': 'application/json',
        "Authorization": "Basic aW9uaWNAaW9uaWMuY29tOiExMjM0NTY3OE5p"
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
    this.qr.onQRClicked(event);
  }

  showOffers(restaurant_id: String) {
    this.navCtrl.push(OffersPage,{restaurant_id: restaurant_id});
  }
}
