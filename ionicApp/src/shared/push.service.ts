import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Push, PushObject, PushOptions, EventResponse} from "@ionic-native/push";
import {RequestMethod, Http, RequestOptions, Response} from "@angular/http";
import {SERVER_URL} from "../app/app.module";
import {Alert, AlertController} from "ionic-angular";
import {AuthService} from "./auth.service";
import {Error} from "tslint/lib/error";
/**
 * Initializing push and notfication settings.
 * @author Sergej Bardin
 */
@Injectable()
export class PushService {

    private pushObject: PushObject;
    constructor(public push: Push,
                private alertCtrl: AlertController,
                private auth: AuthService,
                private http: Http) {

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
            },
            windows: {}
        };
        this.pushObject = this.push.init(pushOptions);
        this.notificationSetup();
    }

    /**
     *  Setup of the display of the push notification
     */
    public notificationSetup(): void {
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
            });
    }

    /**
     * Register push token at backend, when user is logged in
     */
    public pushSetup(): void {
        //prepare RequestOptions
        const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Post);

        this.pushObject.on('registration')
            .subscribe((registration: EventResponse) => {
                this.http.get(`${SERVER_URL}/api/submitToken/${registration.registrationId}`, options)
                    .retry(2)
                    .subscribe(
                        (res: Response) => {
                            console.warn("Device registered at firebase", res);
                        },
                        (err: Error) => console.error(err)
                    );
            });
        this.pushObject.on('error').subscribe((error: Error) => console.error("Error with push plugin or firebase", error));
    }
}
