import {Injectable} from '@angular/core';
import {NavParams, ToastController} from "ionic-angular";
import {Headers, Http, RequestOptions, RequestMethod} from "@angular/http";
import {SERVER_URL} from "../app/app.module";
import {BarcodeScanner} from '@ionic-native/barcode-scanner';

@Injectable()
export class QRService {
  private loggedIn: boolean;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    private http: Http
  ) {
  }

  public onQRClicked(event) {
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
}
