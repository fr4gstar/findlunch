import {Component} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {AuthService} from "../../providers/auth-service";
import {HomePage} from "../home/home";
import {InAppBrowser} from "@ionic-native/in-app-browser";


@Component({
  selector: 'registry',
  templateUrl: 'registry.html'
})
export class RegistryPage {

  termsAndConditions : boolean;

  constructor(private http: Http,
              private auth: AuthService,
              private toastCtrl: ToastController,
              private navCtrl: NavController,
              private iab: InAppBrowser)
{

  }


  public onRegisterClicked(username: string, password: string, password2: string) {
    if (!this.passwordsIdentical(password, password2)) {
      alert("Passwörter stimmen nicht überein");
    }
    this.auth.register(username,password).then( result => {
      const toast = this.toastCtrl.create({
        message: "Registrierung und Login erfolgreich!",
        duration: 3000});
      toast.present();
        this.navCtrl.setRoot(HomePage); // TODO: zu "Meine Bestellung" also Warenkorb zurück schicken?
    })
    .catch(error => {
      switch (error) {
        case "1" :
          alert("keine gültige E-Mail Adresse");
          break;
        case "2" :
          alert("Passwort entspricht nicht den Passwortrichtlinien (mind. 5 Zeichen, 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Zahl, 1 Sonderzeichen)");
          break;
        case "3" :
          alert("E-Mail adresse bereits vergeben");
          break;

        default : ;
      }
    })

  }


  private passwordsIdentical( password: string, password2: string) {
    if (password !== password2) {
      alert("Passworteingaben stimmen nicht überein, bitte überprüfen Sie Ihre Eingabe");
      return false;
    }
    else
      return true;
  }

  public goToTermsAndConditions(){
    let browser = this.iab.create("https://youtube.com");
  }
}


