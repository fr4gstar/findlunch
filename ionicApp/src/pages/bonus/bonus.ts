import {Component, OnInit} from "@angular/core";
import {Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {QRService} from "./qr.service";
import {TranslateService} from '@ngx-translate/core';
import {LoadingService} from "../../shared/loading.service";
import {AuthService} from "../../shared/auth.service";
import {Event} from "_debugger";
import {Loading} from "ionic-angular";
import {Error} from "tslint/lib/error";

/**
 * This pages loads and shows the points of an user per restaurant.
 * Also shows the barcode scanner (qr scanner) function.
 * @author Sergej Bardin
 */
@Component({
    templateUrl: 'bonus.html'
})
export class BonusPage implements OnInit {
    public points: Object[];
    private strLoadPointsError: string;
    constructor(private http: Http,
                private qr: QRService,
                private auth: AuthService,
                private loading: LoadingService,
                private translate: TranslateService) {
    }
    public ngOnInit() : void {
        this.translate.get('Error.points').subscribe(
            (value: string) => {
                this.strLoadPointsError = value;
                },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.points.", err);
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
                    alert(this.strLoadPointsError);
                }
            );
    }
}
