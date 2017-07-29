import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {EventResponse, Push, PushObject, PushOptions} from "@ionic-native/push";
import {Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {APP_LANG, SERVER_URL} from "../app/app.module";
import {Alert, AlertController} from "ionic-angular";
import {AuthService} from "./auth.service";
import {Error} from "tslint/lib/error";
import {TranslateService} from "@ngx-translate/core";

/**
 * Initializing push and notfication settings.
 * @author Sergej Bardin
 */
@Injectable()
export class PushService {

    private pushObject: PushObject;
    private strPushError: string;

    constructor(public push: Push,
                private alertCtrl: AlertController,
                private auth: AuthService,
                private http: Http,
                private translate: TranslateService) {
        this.translate.setDefaultLang(APP_LANG);
        this.translate.get('Error.pushReg').subscribe(
            (value: string) => {
                this.strPushError = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.pushReg.", err);
            }
        );
        const pushOptions: PushOptions = {
            android: {
                senderID: '343682752512',
                icon: 'ic_notify',
                vibrate: true
            },
            ios: {
                alert: 'false',
                badge: true,
                sound: 'false'
            }
        };
        this.pushObject = this.push.init(pushOptions);
        this.notificationSetup();
    }

    /**
     *  Setup of the display of the push notification
     */
    public notificationSetup(): void {
        //noinspection TsLint
        this.push.hasPermission()
            .then((data: any) => {
                if (data.isEnabled) {
                    console.warn('Push permission granted');
                    this.pushObject.on('notification')
                        .subscribe((notification: EventResponse) => {
                            // Foreground handling
                            if (notification.additionalData.foreground) {
                                const alert: Alert = this.alertCtrl.create({
                                    title: notification.title,
                                    message: notification.message,
                                    buttons: [{
                                        text: 'Ok',
                                        role: 'cancel'
                                    }]
                                });
                                alert.present();
                            }
                            // If background then display as typical notification
                        });

                } else {
                    console.warn("Push permission NOT granted, reservation confirmation can not reveiced!");
                }
            });
    }

    /**
     * Register push token at backend, when user is logged in
     */
    public pushSetup(): void {
        const pushOptions: PushOptions = {
            android: {
                senderID: '343682752512',
                icon: 'ic_notify',
                vibrate: true
            },
            ios: {
                alert: 'false',
                badge: true,
                sound: 'false'
            }
        };
        this.pushObject = this.push.init(pushOptions);

        //noinspection TsLint - data format
        this.push.hasPermission()
            .then((data: any) => {
                if (this.auth.getLoggedIn() && data.isEnabled) {
                    //prepare RequestOptions
                    const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Put);

                    this.pushObject.on('registration')
                        .subscribe((registration: EventResponse) => {
                            this.http.get(`${SERVER_URL}/api/submitToken/${registration.registrationId}`, options)
                                .retry(2)
                                .subscribe(
                                    (res: Response) => {
                                        console.warn("Device registered at firebase and backend");
                                    },
                                    (err: Error) => {
                                        console.error(err);
                                        alert(this.strPushError);
                                    }
                                );
                        });
                    this.pushObject.on('error').subscribe((error: Error) => console.error("Error with receiving push from firebase", error));
                } else {
                    console.warn("Push permission NOT granted, reservation confirmation can not received!");
                }
            });
    }
}
