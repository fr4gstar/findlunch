import {Injectable} from "@angular/core";
import {KitchenType} from "../../model/KitchenType";
import {Http, Response} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {Alert, AlertController, Platform} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";

/**
 * This serves as a communication-service between the filtering popover-component and the map.
 * It holds the state of the currently selected filters.
 * @author David Sautter
 */
@Injectable()
export class FilterPopoverService {

    // filter states
    public selectedKitchenTypes: KitchenType[];
    public showOnlyFavorites: boolean;
    public showOnlyOpened: boolean;

    // all possible kitchen-types (fetched from the server)
    public kitchenTypes: KitchenType[];

    // GUI-strings
    private strErrorGeneral: string;
    private strErrorServiceNotAvailable: string;
    private strClose: string;
    private strRetry: string;

    constructor(
        private http: Http,
        private alertCtrl: AlertController,
        private translate: TranslateService,
        private platform: Platform
    ) {
        this.init();
    }

    public init(): void {
        // get translations
        this.translate.get('Error.general').subscribe(
            (res: string) => {
                this.strErrorGeneral = res;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.general.", err);
            });

        this.translate.get('Error.serviceNotAvailable').subscribe(
            (res: string) => {
                this.strErrorServiceNotAvailable = res;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.serviceNotAvailable.", err);
            });
        this.translate.get('close').subscribe(
            (res: string) => {
                this.strClose = res;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key close.", err);
            });
        this.translate.get('retry').subscribe(
            (res: string) => {
                this.strRetry = res;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key retry.", err);
            });


        // fetch the kitchen types from the server
        this.fetchKitchenTypes();
    }


    /**
     * Fetches kitchentypes from the server.
     * If the request fails, it shows an alert with the options to retry or close the app.
     */
    private fetchKitchenTypes(): void {
        this.http.get(`${SERVER_URL}/api/kitchen_types`)
            .retry(2)
            .subscribe(
                (res: Response) => {
                    this.kitchenTypes = res.json();

                    // initially select all kitchen-types
                    this.selectedKitchenTypes = this.kitchenTypes;
                },
                (err: Error) => {
                    console.error("Error fetching kitchenTypes", err);

                    // show error alert with action-buttons
                    const alert: Alert = this.alertCtrl.create({
                        title: this.strErrorGeneral,
                        subTitle: this.strErrorServiceNotAvailable,
                        buttons: [
                            {
                                text: this.strClose,
                                role: 'cancel',
                                handler: (): void => {
                                    // close the app
                                    this.platform.exitApp();
                                }
                            },
                            {
                                text: this.strRetry,
                                handler: (): void => {
                                    // recursive call! Fetch kitchen types again.
                                    this.fetchKitchenTypes();
                                }
                            }
                        ]

                    });
                }
            );
    }
}
