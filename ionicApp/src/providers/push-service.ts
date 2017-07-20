import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Push, PushObject, PushOptions} from "@ionic-native/push";
import {RequestMethod, Http, Headers, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../app/app.module";
import {AlertController} from "ionic-angular";


@Injectable()
export class PushService {

private pushObject: PushObject;

    constructor(public push: Push,
                private alertCtrl: AlertController,
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

    notificationSetup() {
        this.pushObject.on('notification')
            .subscribe((notification: any) => {

                // Foreground handling
                if (notification.additionalData.foreground) {
                    let youralert = this.alertCtrl.create({
                        title: notification.title,
                        message: notification.message,
                        buttons: [{
                            text: 'Okay',
                            role: 'cancel'
                        }],
                    });
                    youralert.present();
                }
            });
    }

    pushSetup() {
        let user = window.localStorage.getItem("username");
        let token = window.localStorage.getItem(user);
        let headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": "Basic " + token
        });

        let options = new RequestOptions({
            headers: headers,
            method: RequestMethod.Put
        });

        this.pushObject.on('registration')
            .subscribe((registration: any) => {
                this.http.get(`${SERVER_URL}/api/submitToken/${registration.registrationId}`, options)
                    .subscribe(
                        res => res,
                        err => console.error(err)
                    )
            });

        this.pushObject.on('error').subscribe(error => console.log('Error with Push plugin' + error));
    }
}
