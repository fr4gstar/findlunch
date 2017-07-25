import {Injectable} from '@angular/core';
import {NavParams, ToastController} from "ionic-angular";
import {Headers, Http, RequestOptions, RequestMethod} from "@angular/http";
import {SERVER_URL} from "../app/app.module";
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "./auth-service";
/**
 * Handles the barcode scanner function of the device.
 * With the barcode scanner it is possible to scan qr codes
 * and send it to the backend to confirm a reservation.
 */
@Injectable()
export class QRService {

    private confirmOrderSuccess;
    private restaurantNotFound;
    private offerNotFound;
    private qrError;

  /**
   *  Initialize modules and sets the language translation settings
   *
   * @param barcodeScanner for scanning
   * @param toastCtrl for displaying messages
   * @param http for requests
   * @param translate for internationalization feature
   */
  constructor(
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    private http: Http,
    private auth: AuthService,
    private translate: TranslateService
  ) {
      translate.setDefaultLang('de');
      this.translate.get('Success.confirmOrder').subscribe(
          value => { this.confirmOrderSuccess = value }
      );
      this.translate.get('Error.confirmOrderRestaurant').subscribe(
          value => { this.restaurantNotFound = value }
      );
      this.translate.get('Error.confirmOrderOffer').subscribe(
          value => { this.offerNotFound = value }
      );
      this.translate.get('Error.qr').subscribe(
          value => { this.qrError = value }
      );
  }

  /**
   * Handles the barcode scanner function of the device.
   * Sends a request with a qr code to the backend.
   * While request is underway,
   * There will displayed a message if:
   * - succesfully confirmed an reservation
   * - there is no restaurant(qr code unknown)
   * - there is no offer
   * - the request to the backend fails
   * - the devices barcode scanner got a problem.
   *
   * @param event
   * @return promise of barcode result
   */
  public onQRClicked(event) {

    return this.barcodeScanner.scan()
      .then((barcodeData) => {

        //preparing Requestoptions
        let options = this.auth.prepareHttpOptions(RequestMethod.Put);

        this.http.get(`${SERVER_URL}/api/confirm_reservation/`+barcodeData.text, options)
          .subscribe(
            (res) => {
              let msg;
              switch (res.json()){
                case 0:
                  msg = this.confirmOrderSuccess;
                  break;
                case 3:
                  msg = this.restaurantNotFound;
                  break;
                case 4:
                  msg = this.offerNotFound;
                  break;
              }
              const toast = this.toastCtrl.create({
                message: msg,
                duration: 3000
              });
              toast.present();
            },
            (err) => {
                console.info("QR scan abort or server response error!");
                const toast = this.toastCtrl.create({
                    message: this.qrError,
                    duration: 3000
                });
                toast.present();
            }
          )
      }, (err) => {
          const toast = this.toastCtrl.create({
              message: this.qrError,
              duration: 3000
          });
          toast.present();
      });
  }
}
