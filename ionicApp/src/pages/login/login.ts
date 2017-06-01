import { Component } from '@angular/core';
import {NavController, ToastController} from "ionic-angular";
import {Headers, Http, RequestOptions} from "@angular/http";
import {ModalController} from "ionic-angular";

import {SERVER_URL} from "../../app/app.module";
import {HomePage} from "../home/home";
import {RegistryPage} from "../registry/registry";
import {AuthService} from "../../providers/auth-service";


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'

})
export class LoginPage {

  constructor(private navCtrl: NavController, private http: Http, private toastCtrl: ToastController,
              private auth: AuthService, private modCtrl: ModalController) {
  }


  public login(userName: string, password: string) { // TODO: das hier muss hier raus

    if(this.auth.login(userName,password)){
     const toast = this.toastCtrl.create({
     message: "Login Erfolgreich",
     duration: 3000});
     toast.present();
     this.navCtrl.push(HomePage);
    } else{
      alert("E-Mail und/oder Passwort nicht bekannt");
    }
      /*
    let encodedCredentials: String = btoa(userName+":"+password);
    console.log(encodedCredentials);
    let headers = new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic " + encodedCredentials
    });

    let options = new RequestOptions({headers: headers});
    this.http.get(SERVER_URL + "/api/login_user", options).subscribe(
      (res) => {
        window.localStorage.setItem(userName,"loggedIn");
        const toast = this.toastCtrl.create({
          message: "Login Erfolgreich",
          duration: 3000
        });
        toast.present();
        this.navCtrl.push(HomePage);
      }, (err) => {
        alert("E-Mail und/oder Passwort nicht bekannt");

      })
      */
  }
  public goToRegisterPage(){
    this.navCtrl.push(RegistryPage);
  }
}
