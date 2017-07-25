import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Push, PushObject, PushOptions} from "@ionic-native/push";
import {RequestMethod, Http, Headers, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../app/app.module";
import {AlertController} from "ionic-angular";
import {AuthService} from "./auth-service";


@Injectable()
export class PushService {

private pushObject: PushObject;

    /**
     *  Initialize modules and setup push function
     *
     * @param push
     * @param alertCtrl
     * @param http
     */
    constructor(public push: Push,
                private alertCtrl: AlertController,
                private auth: AuthService,
                private http: Http) {

        const pushOptions: PushOptions = {
            android: {
                senderID: '343682752512',
                icon: '',
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
    notificationSetup() {
        this.pushObject.on('notification')
            .subscribe((notification: any) => {

                // Foreground handling
                if (notification.additionalData.foreground) {
                    let youralert = this.alertCtrl.create({
                        title: notification.title,
                        message: notification.message,
                        buttons: [{
                            text: 'Ok',
                            role: 'cancel'
                        }],
                    });
                    youralert.present();
                }
            });
    }

    /**
     * Register push token at backend, when user is logged in
     */
    pushSetup() {
        //prepare RequestOptions
        let options = this.auth.prepareHttpOptions(RequestMethod.Post);

        this.pushObject.on('registration')
            .subscribe((registration: any) => {
                this.http.get(`${SERVER_URL}/api/submitToken/${registration.registrationId}`, options)
                    .subscribe(
                        res => res,
                        err => console.error(err)
                    )
            });

        this.pushObject.on('error').subscribe(error => console.error('Error with Push plugin: ' + error));
    }
}
