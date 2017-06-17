import { Component } from '@angular/core';
import {NavController, ToastController} from "ionic-angular";
import {ModalController} from "ionic-angular";
import {Platform} from "ionic-angular";

import {SERVER_URL} from "../../app/app.module";
import {HomePage} from "../home/home";
import {RegistryPage} from "../registry/registry";
import {AuthService} from "../../providers/auth-service";
import {Firebase} from "@ionic-native/firebase";
import {Headers, Http, RequestOptions, RequestMethod} from "@angular/http";




@Component({
  selector: 'login-page',
  templateUrl: 'login.html'

})
export class LoginPage {

  constructor(public platform: Platform,
              private modCtrl: ModalController,
              private http: Http,
              private navCtrl: NavController,
              private firebase: Firebase,
              private auth: AuthService,
              private toastCtrl: ToastController) { //TODO: Modalcontroller für Registerpage
  }


  public login(userName: string, password: string) {
    this.auth.login(userName, password).then(data => {
      if (data) {
        this.getFirebaseToken();
        const toast = this.toastCtrl.create({
          message: "Login Erfolgreich",
          duration: 3000
        });
        toast.present();
        this.navCtrl.setRoot(HomePage);
      } else {
        alert("E-Mail und/oder Passwort nicht bekannt");
      }
    });

  }

  public goToRegisterPage() {
    this.navCtrl.push(RegistryPage);
  }

  public getFirebaseToken() {
    let token = window.localStorage.getItem(window.localStorage.getItem("username"));
    let headers = new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic " + token
    });
    let options = new RequestOptions({
      headers: headers,
      method: RequestMethod.Put
    });

    this.platform.ready().then(() => {

      if (this.platform.is("cordova")) {
        // we are not in the web, but on a native platform
        this.firebase.getToken()
          .then(token =>
            this.http.get(`${SERVER_URL}/api/submitToken/${token}`, options)
              .subscribe(
                res => console.log(res),
                err => console.error(err)
              ))
          .catch(error => console.error('Error getting token', error));

        this.firebase.onTokenRefresh()
          .subscribe((token: string) => console.log(`Got a new token ${token}`));
      }
      else {
        // we are in the web
        const msg = (<any>window).firebase.messaging();
        msg.useServiceWorker((<any>window).firebaseSWRegistration);

        msg.getToken()
          .then(token =>
            this.http.get(`${SERVER_URL}/api/submitToken/${token}`, options)
              .subscribe(
                res => console.log(res),
                err => console.error(err)
              )
          )
          .then(function (currentToken) {
            if (currentToken) {
              msg.onMessage(function (payload) {
                console.log("Message received. ", payload);
              });
            } else {
              // Show permission request.
              console.log('No Instance ID token available. Request permission to generate one.');
              // Show permission UI.
              // updateUIForPushPermissionRequired();
              // setTokenSentToServer(false);
              return "No Instance ID";
            }
          })
          .catch(function (err) {
            console.log('An error occurred while retrieving token. ', err);
            // showToken('Error retrieving Instance ID token. ', err);
            // setTokenSentToServer(false);
          });
      }

    });
  }
}
