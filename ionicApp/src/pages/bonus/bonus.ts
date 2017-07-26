import {Component} from "@angular/core";
import {Http, RequestMethod} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {QRService} from "../../providers/QRService";
import {TranslateService} from '@ngx-translate/core';
import {LoadingService} from "../../providers/loading-service";
import {AuthService} from "../../providers/auth-service";

/**
 * This pages loads and shows the points of an user per restaurant.
 * Also shows the barcode scanner (qr scanner) function.
 * @author Sergej Bardin
 */
@Component({
    templateUrl: 'bonus.html'
})

//TODO: Typisierung der Methoden

export class BonusPage {

    //TODO: Comment to points array
    public points: Object[];


    constructor(private http: Http,
                private qr: QRService,
                private auth: AuthService,
                private loading: LoadingService,
                translate: TranslateService) {

        //TODO: loadpoints into onInit method
        this.loadPoints();
        translate.setDefaultLang('de');
    }

    /**
     * Opens the barcode scanner(camera) of the device via service
     *
     */
    onQRClicked(event) {
        this.qr.onQRClicked(event).then(
            () => {
                //TODO: check whether this.loadpoints()
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
        let options = this.auth.prepareHttpOptions(RequestMethod.Get);
        this.http.get(`${SERVER_URL}/api/get_points`, options)
            .retry(2)
            .subscribe(
                res => {
                    this.points = res.json()
                    loader.dismiss();
                },
                err => {
                    console.error("Getting userPoints error" + err);
                    loader.dismiss();
                }
            )
    }
}
