import {Component, OnInit} from "@angular/core";
import {Alert, Loading, NavController, NavParams, Toast, ToastController} from "ionic-angular";
import {Headers, Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {HomePage} from "../home/home";
import {RegistryPage} from "../registry/registry";
import {AuthService} from "../../shared/auth.service";
import {SERVER_URL} from "../../app/app.module";
import {LoadingService} from "../../shared/loading.service";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {Restaurant} from "../../model/Restaurant";
import {TranslateService} from '@ngx-translate/core';
import {PushService} from "../../shared/push.service";

/**
 * Page that lets the user enter his account credentials and gives him access to the
 * logged-in user functionalities and pages.
 * @author Skanny Morandi - Sergej Bardin
 */
@Component({
    templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
    private popThisPage: boolean;
    private counterPasswordWrong: number = 0;
    private restaurant: Restaurant;
    private strLoginError: string;
    private strLoginSuccessful: string;
    private strConnectionError: string;
    private strPasswordResetSuccess: string;

    constructor(private navCtrl: NavController,
                private toastCtrl: ToastController,
                private auth: AuthService,
                private http: Http,
                private push: PushService,
                private navParams: NavParams,
                private loading: LoadingService,
                private translate: TranslateService) {
        // When comeBack is true, after login user is sent back to the view he came from
        this.popThisPage = navParams.get("comeBack");
    }

    public ngOnInit(): void {
        this.translate.get('Error.login').subscribe(
            (value: string) => {
                this.strLoginError = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.login.", err);
            });
        this.translate.get('Success.login').subscribe(
            (value: string) => {
                this.strLoginSuccessful = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Success.login.", err);
            });
        this.translate.get('Error.connection').subscribe(
            (value: string) => {
                this.strConnectionError = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.connection.", err);
            });
        this.translate.get('Success.passwordReset').subscribe(
            (value: string) => {
                this.strPasswordResetSuccess = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Success.passwordReset.", err);
            });
    }

    /**
     * Logs the user in. LoggedIn is stateless (without session etc.).
     * If the authentication fails it activates the password reset button.
     *
     * @param userName
     * @param password
     */
    public login(userName: string, password: string): void {
        const loader: Loading = this.loading.prepareLoader();
        loader.present().then(() => {
            this.auth.login(userName, password).subscribe(
                (data: Response) => {
                    if (data) {
                        const toast: Toast = this.toastCtrl.create({
                            message: this.strLoginSuccessful,
                            duration: 3000
                        });
                        toast.present();
                        this.push.pushSetup();
                        // When comeBack is true, after login user is sent back to the view he came from
                        if (this.popThisPage) {
                            this.restaurant = this.navParams.get("restaurant");
                            this.navCtrl.push(OrderDetailsPage, {
                                restaurant: this.restaurant
                            });
                            loader.dismiss();

                        } else {
                            // else go back to homePage
                            this.navCtrl.setRoot(HomePage);
                            loader.dismiss();
                        }
                    } else {
                        this.counterPasswordWrong++;
                        loader.dismiss();
                        alert(this.strLoginError);
                    }
                },
                (err: Error) => {
                    this.counterPasswordWrong++;
                    loader.dismiss();
                    console.error("Login failed!", err);
                    alert(this.strLoginError);
                }
            );
        });
    }

    /**
     * sends user to RegisterPage
     */
    public goToRegisterPage(): void {
        this.navCtrl.push(RegistryPage);
    }

    /**
     * Checks whether there is a string in the user name field and whether password was
     * entered wrong
     * @param username = email address of user
     */
    public isEmptyUser(username: string): boolean {
        return !(username && this.counterPasswordWrong >= 1);
    }

    /**
     * Requesting a password reset by the backend
     * @param username = email adress of user
     */
    public sendPasswordReset(username: string): void {
        const headers: Headers = new Headers({
            'Content-Type': 'application/json'
        });

        const user: Object = {username: username};

        const options: RequestOptions = new RequestOptions({
            headers: headers,
            method: RequestMethod.Put,
            body: JSON.stringify(user)
        });
        const loader: Loading = this.loading.prepareLoader();
        loader.present().then(() => {
            this.http.get(`${SERVER_URL}/api/get_reset_token`, options)
                .timeout(8000)
                .subscribe(
                    (res: Response) => {
                        let msg: string;
                        switch (res.json()) {
                            case 0:
                                msg = this.strPasswordResetSuccess;
                                break;
                            default:
                                msg = this.strConnectionError;
                                break;
                        }
                        const toast: Toast = this.toastCtrl.create({
                            message: msg,
                            duration: 3000
                        });
                        toast.present();
                    },
                    (err: Error) => {
                        console.error(err);
                        alert(this.strConnectionError);
                    }
                );
        });
    }
}
