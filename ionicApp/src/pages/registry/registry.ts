import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {AuthService} from "../../providers/auth-service";
import {HomePage} from "../home/home";
import {InAppBrowser} from "@ionic-native/in-app-browser";


@Component({
  selector: 'registry',
  templateUrl: 'registry.html'
})
export class RegistryPage {

  termsAndConditionsChecked : boolean;
  popThisPage : boolean;

  constructor(private auth: AuthService,
              private toastCtrl: ToastController,
              private navCtrl: NavController,
              navParams: NavParams,
              private iab: InAppBrowser)
{
  this.popThisPage = navParams.get("comeBack");
  this.termsAndConditionsChecked = false;
  }


  public onRegisterClicked(username: string, password: string, password2: string) {
    if (!this.passwordsIdentical(password, password2)) {
      alert("Passwörter stimmen nicht überein");

    }else if(!this.termsAndConditionsChecked){
      const toast = this.toastCtrl.create({
        message: "Um sich zu registrieren, bitte bestätigen Sie bitte unsere allgemeinen Beschäftsbedniungenen",
        duration: 3000});
      toast.present();

    } else{

      this.auth.register(username,password).then( result => {
        const toast = this.toastCtrl.create({
          message: "Registrierung und Login erfolgreich!",
          duration: 3000});
        toast.present();
          console.log("comeBack flag is set: " +this.popThisPage);
          if(this.popThisPage){
            this.navCtrl.pop();
          } else{
          this.navCtrl.setRoot(HomePage);
          }
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
    let browser = this.iab.create("https://shrouded-dusk-87807.herokuapp.com/terms");
  }
}


