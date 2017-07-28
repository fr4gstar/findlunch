import {Injectable, OnInit} from '@angular/core';
import {Toast, ToastController} from "ionic-angular";
import {Http, RequestOptions, RequestMethod, Response} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {BarcodeScanner, BarcodeScanResult} from '@ionic-native/barcode-scanner';
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../shared/auth.service";
import {Event} from "_debugger";
import {Error} from "tslint/lib/error";
/**
 * Handles the barcode scanner function of the device.
 * With the barcode scanner it is possible to scan qr codes
 * and send it to the backend to confirm a reservation.
 * @author Sergej Bardin
 */
@Injectable()
export class QRService implements OnInit {
    private strConfirmOrderSuccess: string;
    private strRestaurantNotFound: string;
    private strOfferNotFound: string;
    private strQRError: string;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    private http: Http,
    private auth: AuthService,
    private translate: TranslateService
  ) {
  }
  public ngOnInit(): void {
      this.translate.get('Success.confirmOrder').subscribe(
          (value: string) => {
              this.strConfirmOrderSuccess = value;
              },
          (err: Error) => {
              console.error("Error: translate.get did fail for key Success.confirmOrder.", err);
          });
      this.translate.get('Error.confirmOrderRestaurant').subscribe(
          (value: string) => {
              this.strRestaurantNotFound = value;
              },
          (err: Error) => {
              console.error("Error: translate.get did fail for key Error.confirmOrderRestaurant.", err);
          });
      this.translate.get('Error.confirmOrderOffer').subscribe(
          (value: string) => {
              this.strOfferNotFound = value;
              },
          (err: Error) => {
              console.error("Error: translate.get did fail for key Error.confirmOrderOffer.", err);
          });
      this.translate.get('Error.qr').subscribe(
          (value: string) => {
              this.strQRError = value;
          },
          (err: Error) => {
              console.error("Error: translate.get did fail for key Error.qr.", err);
          });
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
  public onQRClicked(event: Event): Promise<void> {
    return this.barcodeScanner.scan()
      .then((barcodeData: BarcodeScanResult) => {
        //preparing Requestoptions
        const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Put);

        this.http.get(`${SERVER_URL}/api/confirm_reservation/${barcodeData.text}`, options)
            .retry(2)
            .subscribe(
              (res: Response) => {
              let msg: string;
              switch (res.json()) {
                case 0:
                  msg = this.strConfirmOrderSuccess;
                  break;
                case 3:
                  msg = this.strRestaurantNotFound;
                  break;
                case 4:
                  msg = this.strOfferNotFound;
                  break;
                default:
                  msg = this.strQRError;
                  break;
              }
              const toast: Toast = this.toastCtrl.create({
                message: msg,
                duration: 3000
              });
              toast.present();
            },
              (err: Error) => {
                console.error("QR Scan: Server response error!", err);
                const toast: Toast = this.toastCtrl.create({
                    message: this.strQRError,
                    duration: 3000
                });
                toast.present();
            }
          );
        },  (err: Error) => {
          console.error("QR-Scan Error!", err);
          const toast: Toast = this.toastCtrl.create({
              message: this.strQRError,
              duration: 3000
          });
          toast.present();
      });
  }
}
