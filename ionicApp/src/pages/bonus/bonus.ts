import {Component} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {QRService} from "../../providers/QRService";
import {TranslateService} from '@ngx-translate/core';
import {LoadingService} from "../../providers/loading-service";
import {AuthService} from "../../providers/auth-service";

/**
 * This pages loads and shows the points of an user per restaurant.
 * Also shows the barcode scanner (qr scanner) function.
 */
@Component({
    selector: 'bonus',
    templateUrl: 'bonus.html'
})

export class BonusPage {
    /**
     * Object with restaurant and user points
     */
    public points: Object[];

    /**
     *  Initialize modules and loadPoints for an user.
     *
     * @param toastCtrl for displaying messages
     * @param http for requests
     * @param qr for using barcode functions
     */
    constructor(private toastCtrl: ToastController,
                private http: Http,
                private qr: QRService,
                private auth: AuthService,
                private loading: LoadingService,
                translate: TranslateService) {
        this.loadPoints();
        translate.setDefaultLang('de');
    }

    /**
     * Opens the barcode scanner(camera) of the device via service
     * @param event
     */
    onQRClicked(event) {
        this.qr.onQRClicked(event).then(
            () => {
                this.loadPoints();
            }
        );
    }

    /**
     * Loads available points of an authorized user per restaurant
     */
    loadPoints() {
        //prepare and start loading spinner
       let loader = this.loading.prepareLoader();
       loader.present();

       //prepare http-options
        let options = this.auth.prepareHttpOptions("get");
        this.http.get(`${SERVER_URL}/api/get_points`, options)
            .subscribe(
                res => {
                    this.points = res.json()
                    loader.dismiss();
                },
                        err => console.error("Getting userPoints error" + err)
            )
    }
}
