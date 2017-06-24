import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";

import {HomePage} from "../home/home";
import {RegistryPage} from "../registry/registry";
import {AuthService} from "../../providers/auth-service";


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'

})
export class LoginPage {

  popThisPage : boolean

  constructor(private navCtrl: NavController,
              private toastCtrl: ToastController,
              private auth: AuthService,
              navParams: NavParams) {

    this.popThisPage = navParams.get("comeBack");
  }


  public login(userName: string, password: string) {
    this.auth.login(userName, password).then(data => {
      if (data) {
        console.log("go back to warenkorb ?: " + this.popThisPage);
        debugger;

        const toast = this.toastCtrl.create({
          message: "Login Erfolgreich",
          duration: 3000
        });
        toast.present();

        if(this.popThisPage){
          this.navCtrl.pop();
        }else {
          this.navCtrl.setRoot(HomePage);
        }
      } else{
      alert("E-Mail und/oder Passwort nicht bekannt");
      }
    });

  }

  public goToRegisterPage() {
    this.navCtrl.push(RegistryPage);
  }

}
