import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {Headers, Http, RequestMethod, RequestOptions} from "@angular/http";
import {HomePage} from "../home/home";
import {RegistryPage} from "../registry/registry";
import {AuthService} from "../../shared/auth.service";
import {SERVER_URL} from "../../app/app.module";
import {LoadingService} from "../../shared/loading.service";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {Restaurant} from "../../model/Restaurant";
import {PushService} from "../../shared/push.service";
import { TranslateService } from '@ngx-translate/core';

/**
 * Page that lets the user enter his account credentials and gives him access to the
 * logged-in user functionalities and pages.
 * @author Skanny Morandi
 */

//TODO: Typisierung Methoden
@Component({
    templateUrl: 'login.html'

})

export class LoginPage {

    private popThisPage: boolean;
    private counterPasswordWrong: number = 0;
    private restaurant: Restaurant;
    private loginErrorMsg: string;
    private loginSuccessfulMsg: string;
    private connectionErrorMsg: string;
    private passwordResetSuccessMsg: string;

    constructor(private navCtrl: NavController,
                private toastCtrl: ToastController,
                private auth: AuthService,
                private http: Http,
                private navParams: NavParams,
                private loading: LoadingService,
                private push: PushService,
                private translate: TranslateService) {

        this.popThisPage = navParams.get("comeBack");
        //TODO check why
        this.restaurant = null;

        //TODO: transfer translate to onInit
        translate.setDefaultLang('de');
        this.translate.get('Error.login').subscribe(
            value => { this.loginErrorMsg = value }
        )
        this.translate.get('Success.login').subscribe(
            value => { this.loginSuccessfulMsg = value }
        )
        this.translate.get('Error.connection').subscribe(
            value => { this.connectionErrorMsg = value }
        )
        this.translate.get('Success.passwordReset').subscribe(
            value => { this.passwordResetSuccessMsg = value }
        )
    }

    /**
     * Logs the user in. //TODO kein Serverzustand sondern nur zugang zu logged in seiten
     * //TODO: Passwort zurücksetzen nach einmal wrong password
     *
     * @param userName
     * @param password
     */
    public login(userName: string, password: string) {
        this.counterPasswordWrong++;
        let loader = this.loading.prepareLoader();
        loader.present().then(res => {

            this.auth.login(userName, password).then(data => {
                if (data) {
                    const toast = this.toastCtrl.create({
                        message: this.loginSuccessfulMsg,
                        duration: 3000
                    });
                    toast.present();

                    this.push.pushSetup();

                    if (this.popThisPage) {
                        this.restaurant = this.navParams.get("restaurant");
                        this.navCtrl.push(OrderDetailsPage, {
                            restaurant: this.restaurant
                        });
                        loader.dismiss();

                    } else {
                        this.navCtrl.setRoot(HomePage);
                        loader.dismiss();
                    }
                } else {
                    loader.dismiss();
                    alert(this.loginErrorMsg);
                }
            })
        })

    }

    /**
     * sends user to RegisterPage
     */
    public goToRegisterPage() {
        this.navCtrl.push(RegistryPage);
    }

    /**
     * Checks whether there is a string in the user name field and whether password was
     * entered wrong
     * @param username = email adress of user
     */
    public isEmptyUser(username) {
        //TODO: check whether its enough to
        // return !(username && this.counterPasswordWrong >= 1)
        if (username && this.counterPasswordWrong >= 1) {
            return false;
        }
        return true;
    };

        /**
         * Requesting a password reset by the backend
         * @param username = email adress of user
         */
    public sendPasswordReset(username)
        {
            let headers = new Headers({
                'Content-Type': 'application/json'
            });

            let user = {
                username: username
            };

            let options = new RequestOptions({
                headers: headers,
                method: RequestMethod.Post,
                body: JSON.stringify(user)
            });

            this.http.get(`${SERVER_URL}/api/get_reset_token`, options)
                .retry(2)
                .subscribe(
                    (res) => {
                        let msg;
                        switch (res.json()) {
                            case 0:
                                msg = this.passwordResetSuccessMsg;
                                break;
                            default:
                                msg = this.connectionErrorMsg;
                                break;
                        }
                        const toast = this.toastCtrl.create({
                            message: msg,
                            duration: 3000
                        });
                        toast.present();
                    }, (err) => {
                        console.error(err)
                        //TODO: inform user
                    }
                )
        }

    }
