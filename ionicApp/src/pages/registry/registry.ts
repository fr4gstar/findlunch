import {Component, OnInit} from "@angular/core";
import {Loading, NavController, NavParams, Toast, ToastController} from "ionic-angular";
import {AuthService} from "../../shared/auth.service";
import {HomePage} from "../home/home";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {LoadingService} from "../../shared/loading.service";
import {Restaurant} from "../../model/Restaurant";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {TranslateService} from "@ngx-translate/core";
import {SERVER_URL} from "../../app/app.module";
import {Response} from "@angular/http";

/**
 * Register a new user function. Gets "comeback" navParam, to determine whether to send the view back
 * to where it came from after registering.
 * @author Skanny Morandi
 */
@Component({
    templateUrl: 'registry.html'
})
export class RegistryPage implements OnInit {
    private termsAndConditionsChecked: boolean;
    private popThisPage: boolean;
    private restaurant: Restaurant;

    private strNoValidEmail: string;
    private strNoValidPassword: string;
    private strUsedEmail: string;
    private strConnectionError: string;
    private strConfirmPasswordError: string;
    private strTermsAndConditionError: string;
    private strRegisterSuccess: string;

    constructor(private auth: AuthService,
                private toastCtrl: ToastController,
                private navCtrl: NavController,
                private navParams: NavParams,
                private iab: InAppBrowser,
                private loading: LoadingService,
                private translate: TranslateService) {
        this.popThisPage = navParams.get("comeBack");
        this.termsAndConditionsChecked = false;
    }

    public ngOnInit(): void {
        this.translate.get('Error.noValidEmail').subscribe(
            (value: string) => {
                this.strNoValidEmail = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.noValidEmail.", err);
            }
        );
        this.translate.get('Error.noValidPassword').subscribe(
            (value: string) => {
                this.strNoValidPassword = value;
                },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.noValidPassword.", err);
            }
        );
        this.translate.get('Error.usedEmail').subscribe(
            (value: string) => {
                this.strUsedEmail = value;
                },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.usedEmail.", err);
            }
        );
        this.translate.get('Error.connection').subscribe(
            (value: string) => {
                this.strConnectionError = value;
                },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.connection.", err);
            }
        );
        this.translate.get('Error.confirmPassword').subscribe(
            (value: string) => {
                this.strConfirmPasswordError = value;
                },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.confirmPassword.", err);
            }
        );
        this.translate.get('Error.termsAndCondition').subscribe(
            (value: string) => {
                this.strTermsAndConditionError = value;
                },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Error.termsAndCondition.", err);
            }
        );
        this.translate.get('Success.register').subscribe(
            (value: string) => {
                this.strRegisterSuccess = value;
            },
            (err: Error) => {
                console.error("Error: translate.get did fail for key Success.register.", err);
            }
        );
    }
    /**
     * Username password and password repetitions get checked and registered with the server. If registry not successful
     * suiting error message gets displayed. if successful, logs in directly and goes either back to orderdetails or
     * homepage
     */
    public onRegisterClicked(username: string, password: string, password2: string): void {
        if (!this.passwordsIdentical(password, password2)) {
            alert(this.strConfirmPasswordError);

        } else if (!this.termsAndConditionsChecked) {
            const toast: Toast = this.toastCtrl.create({
                message: this.strTermsAndConditionError,
                duration: 3000
            });
            toast.present();
        }
        const loader: Loading = this.loading.prepareLoader();
        loader.present().then(() => {

            this.auth.register(username, password).then(() => {
                const toast: Toast = this.toastCtrl.create({
                    message: this.strRegisterSuccess,
                    duration: 3000
                });
                toast.present();
                //if coming from Orderdetailspage, go back there after registry

                if (this.popThisPage) {
                    this.restaurant = this.navParams.get("restaurant");
                    this.navCtrl.push(OrderDetailsPage, {
                        restaurant: this.restaurant
                    });
                    loader.dismiss();

                    //else go to Home
                } else {
                    this.navCtrl.setRoot(HomePage);
                }
                loader.dismiss();
            })
                .catch((error: string) => {
                    switch (error) {
                        case "1" :
                            alert(this.strNoValidEmail);
                            break;
                        case "2" :
                            alert(this.strNoValidPassword);
                            break;
                        case "3" :
                            alert(this.strUsedEmail);
                            break;

                        default :
                            alert(this.strConnectionError);

                    }
                    loader.dismiss();
                });

        });

    }

    /**
     * returns whether entered passwords are identical
     *
     * @param password
     * password first entered
     * @param password2
     * password repetition
     * @returns {boolean}
     * whether passwords are identical
     *
     */
    private passwordsIdentical(password: string, password2: string): boolean {
        return (password === password2);
    }

    /**
     * Opens the terms and conditions site via inapp browser
     */
    private goToTermsAndConditions(): void {
        this.iab.create(`${SERVER_URL}/terms`);
    }
}
