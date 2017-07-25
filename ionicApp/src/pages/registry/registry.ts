import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {AuthService} from "../../providers/auth-service";
import {HomePage} from "../home/home";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {LoadingService} from "../../providers/loading-service";
import {Restaurant} from "../../model/Restaurant";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {TranslateService} from "@ngx-translate/core";
import {SERVER_URL} from "../../app/app.module";

@Component({
    selector: 'registry',
    templateUrl: 'registry.html'
})
/**
 * gets "comeback" navParam, to determine whether to send the view back to where it came from after registering
 */
export class RegistryPage {

    termsAndConditionsChecked: boolean;
    popThisPage: boolean;
    restaurant: Restaurant;

    private noValidEmail;
    private noValidPassword;
    private usedEmail;
    private connectionError;

    private confirmPasswordError;
    private termsAndConditionError;
    private registerSuccess;

    constructor(private auth: AuthService,
                private toastCtrl: ToastController,
                private navCtrl: NavController,
                private navParams: NavParams,
                private iab: InAppBrowser,
                private loading: LoadingService,
                private translate: TranslateService) {
        translate.setDefaultLang('de');

        this.translate.get('Error.noValidEmail').subscribe(
            value => { this.noValidEmail = value }
        );
        this.translate.get('Error.noValidPassword').subscribe(
            value => { this.noValidPassword = value }
        );
        this.translate.get('Error.usedEmail').subscribe(
            value => { this.usedEmail = value }
        );
        this.translate.get('Error.connection').subscribe(
            value => { this.connectionError = value }
        );
        this.translate.get('Error.confirmPassword').subscribe(
            value => { this.confirmPasswordError = value }
        );
        this.translate.get('Error.termsAndCondition').subscribe(
            value => { this.termsAndConditionError = value }
        );
        this.translate.get('Success.register').subscribe(
            value => { this.registerSuccess = value }
        );



        this.popThisPage = navParams.get("comeBack");
        this.termsAndConditionsChecked = false;
    }

    /**
     * Username password and password repetitions get checked and registered with the server. If registry not successful
     * suiting error message gehts displayed. if successful, logs in directly and goes either back to orderdetails or
     * homepage
     */
    public onRegisterClicked(username: string, password: string, password2: string) {
        if (!this.passwordsIdentical(password, password2)) {
            alert(this.confirmPasswordError);

        } else if (!this.termsAndConditionsChecked) {
            const toast = this.toastCtrl.create({
                message: this.termsAndConditionError,
                duration: 3000
            });
            toast.present();
        }
        let loader = this.loading.prepareLoader();
        loader.present().then(res => {

            this.auth.register(username, password).then(result => {
                const toast = this.toastCtrl.create({
                    message: this.registerSuccess,
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
                .catch(error => {
                    switch (error) {
                        case "1" :
                            alert(this.noValidEmail);
                            break;
                        case "2" :
                            alert(this.noValidPassword);
                            break;
                        case "3" :
                            alert(this.usedEmail);
                            break;

                        default :
                            alert(this.connectionError);

                    }
                    loader.dismiss();
                })

        })

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
    private passwordsIdentical(password: string, password2: string) {
        return (password === password2);
    }

    /**
     * Opens the terms and conditions site via inapp browser
     */
    public goToTermsAndConditions() {
        let browser = this.iab.create(`${SERVER_URL}+/terms`);
    }
}


