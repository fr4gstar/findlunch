import { Component } from '@angular/core';
import {NavController, ToastController} from "ionic-angular";
import {ModalController} from "ionic-angular";

import {HomePage} from "../home/home";
import {RegistryPage} from "../registry/registry";
import {AuthService} from "../../providers/auth-service";


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'

})
export class LoginPage {

  constructor(private navCtrl: NavController, private toastCtrl: ToastController,
              private auth: AuthService, private modCtrl: ModalController) { //TODO: Modalcontroller für Registerpage
  }


  public login(userName: string, password: string) {
    this.auth.login(userName,password).then(data => {
      if(data) {
        const toast = this.toastCtrl.create({
          message: "Login Erfolgreich",
          duration: 3000});
        toast.present();
        this.navCtrl.setRoot(HomePage);
      } else{
      alert("E-Mail und/oder Passwort nicht bekannt");
      }
    });
  }

  public goToRegisterPage(){
    this.navCtrl.push(RegistryPage);
  }
}
