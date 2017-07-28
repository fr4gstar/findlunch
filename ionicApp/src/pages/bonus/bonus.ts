import {Component, OnInit} from "@angular/core";
import {Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {QRService} from "./qr.service";
import {TranslateService} from '@ngx-translate/core';
import {LoadingService} from "../../shared/loading.service";
import {AuthService} from "../../shared/auth.service";
import {Event} from "_debugger";
import {Loading, Alert, AlertController, NavController} from "ionic-angular";
import {Error} from "tslint/lib/error";
import {HomePage} from "../home/home";

/**
 * This pages loads and shows the points of an user per restaurant.
 * Also shows the barcode scanner (qr scanner) function.
 * @author Sergej Bardin
 */
@Component({
    templateUrl: 'bonus.html'
})
export class BonusPage implements OnInit {
    //noinspection TsLint
    public points: any[];
    private strLoadPointsError: string;
    private strGeneralError: string;
    private strCancel: string;
    private strRetry: string;
    constructor(private http: Http,
                private qr: QRService,
                private auth: AuthService,
                private alertCtrl: AlertController,
                private loading: LoadingService,
                private translate: TranslateService,
                private navCtrl: NavController) {
    }
    public ngOnInit() : void {
        this.translate.get('Error.points').subscribe(
            (value: string) => {
                this.strLoadPointsError = value;
                },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.points.", err);
            });
        this.translate.get('Error.general').subscribe(
            (value: string) => {
                this.strGeneralError = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.general.", err);
            });
        this.translate.get('retry').subscribe(
            (value: string) => {
                this.strRetry = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key retry.", err);
            });
        this.translate.get('cancel').subscribe(
            (value: string) => {
                this.strCancel = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key cancel.", err);
            });
        this.loadPoints();
    }
    /**
     * Opens the barcode scanner(camera) of the device via service
     */
    private onQRClicked (event: Event) : void {
        this.qr.onQRClicked(event)
            .then(() => {
                this.loadPoints();
            });
    }
    /**
     * Loads available points of an authorized user per restaurant
     */
    private loadPoints () : void {
        //prepare and start loading spinner
        const loader: Loading = this.loading.prepareLoader();
        loader.present();

        //prepare http-options
        const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Get);
        this.http.get(`${SERVER_URL}/api/get_points`, options)
            .retry(2)
            .subscribe(
                (res: Response) => {
                    this.points = res.json();
                    loader.dismiss();
                },
                (err: Error) => {
                    console.error("Getting user points error.", err);
                    loader.dismiss();
                    //noinspection TsLint
                    const alert: Alert = this.alertCtrl.create({
                        title: this.strGeneralError,
                        subTitle: this.strLoadPointsError,
                        buttons: [
                            {
                                text: this.strCancel,
                                role: 'cancel',
                                handler: () => {
                                    this.navCtrl.push(HomePage);
                                }
                            },
                                {
                                    text: this.strRetry,
                                    handler: () => {
                                        this.loadPoints();
                                    }
                                }
                            ]

                    });
                    alert.present();
                }
            );
    }
}
