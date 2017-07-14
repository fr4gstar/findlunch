import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {AuthService} from "../../providers/auth-service";
import {HomePage} from "../home/home";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {LoadingService} from "../../providers/loading-service";


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

    constructor(private auth: AuthService,
                private toastCtrl: ToastController,
                private navCtrl: NavController,
                navParams: NavParams,
                private iab: InAppBrowser,
                private loading: LoadingService) {
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
            alert("Passwörter stimmen nicht überein");

        } else if (!this.termsAndConditionsChecked) {
            const toast = this.toastCtrl.create({
                message: "Um sich zu registrieren, bitte bestätigen Sie bitte unsere allgemeinen Beschäftsbedniungenen",
                duration: 3000
            });
            toast.present();
        }
        let loader = this.loading.prepareLoader("Registrieren...");
        loader.present().then(res => {

            this.auth.register(username, password).then(result => {
                const toast = this.toastCtrl.create({
                    message: "Registrierung und Login erfolgreich!",
                    duration: 3000
                });
                toast.present();
                //if coming from Orderdetailspage, go back there after registry
                if (this.popThisPage) {
                    this.navCtrl.pop();
                //else go to Home
                } else {
                    this.navCtrl.setRoot(HomePage);
                }
                loader.dismiss();
            })
                .catch(error => {
                    switch (error) {
                        case "1" :
                            alert("keine gültige E-Mail Adresse");
                            break;
                        case "2" :
                            alert("Passwort entspricht nicht den Passwortrichtlinien: \n" +
                                "mind. 5 Zeichen, 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Zahl, 1 Sonderzeichen");
                            break;
                        case "3" :
                            alert("E-Mail adresse bereits vergeben.");
                            break;

                        default :
                            alert("Anfrage fehlgeschlagen");

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

    public goToTermsAndConditions() {
        let browser = this.iab.create("https://shrouded-dusk-87807.herokuapp.com/terms");
    }
}


