import {Component, OnInit} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Headers, Http, RequestMethod, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {QRService} from "../../providers/QRService";
import {Observable} from "rxjs/Observable";

/**
 * This pages loads and shows the points of an user per restaurant.
 * Also shows the barcode scanner (qr scanner) function.
 */
@Component({
    selector: 'bonus',
    templateUrl: 'bonus.html'
})

export class BonusPage implements OnInit {
  /**
   * Observable with restaurant and user points
   */

  public points$: Observable<any>;

  /**
   *  Initialize modules
   *
   * @param toastCtrl for displaying messages
   * @param http for requests
   * @param qr for using barcode functions
   */
    constructor(
      private toastCtrl: ToastController,
      private http: Http,
      private qr: QRService) {
    }

    /**
     * Loads available points of an authorized user per restaurant
     */
    ngOnInit() {
      let user = window.localStorage.getItem("username");
      let token = window.localStorage.getItem(user);
      let headers = new Headers({
        'Content-Type': 'application/json',
        "Authorization": "Basic " +token
      });

      let options = new RequestOptions({
        headers: headers,
        method: RequestMethod.Get
      });

        this.points$ = this.http.get(`${SERVER_URL}/api/get_points`, options).map(res => res.json());
    }

  /**
   * Opens the barcode scanner(camera) of the device via service
   * @param event
   */
  onQRClicked(event) {
    this.qr.onQRClicked(event);
  }
}
