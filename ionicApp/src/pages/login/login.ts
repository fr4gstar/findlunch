import { Component } from '@angular/core';
import {NavController, ToastController} from "ionic-angular";
import {HTTP} from "@ionic-native/http";
import {Headers, Http, RequestOptions} from "@angular/http";

import {SERVER_URL} from "../../app/app.module";
import {RestaurantsPage} from "../restaurants/restaurants";


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'

})
export class LoginPage {
  // private userName : String;
  // private Password : String;

  constructor(private navCtrl: NavController, private http: Http, private toastCtrl: ToastController) {
  }

  public submitCredentials(userName: string, password: string) {
    //   //TODO: find way to base64 encode username and pw for http basic auth
    //   var authHeader: Object = this.http.getBasicAuthHeader(userName,password);
    //   //var credentials: String = $base64.encode(userName+":"+password);
    //
    //   this.http.get(`${SERVER_URL}/login_user`, {}, authHeader)
    //    .then(data =>{
    //      this.navCtrl.push(RestaurantsPage);
    //      const toast = this.toastCtrl.create({
    //        message: "Login erfolgreich",
    //        duration: 3000
    //      });
    //      toast.present();
    //     })
    //    .catch(error => {
    //     console.log(error.error);
    //   });
    //  }

    let headers = new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic aW9uaWNAaW9uaWMuY29tOiExMjM0NTY3OE5p"
    });
    let options = new RequestOptions({headers: headers});
   // this.http.acceptAllCerts(true);
    this.http.get(SERVER_URL + "/api/login_user", options).subscribe(
      (res) => {
        const toast = this.toastCtrl.create({
          message: "Login Erfolgreich",
          duration: 3000
        });
        toast.present();
        this.navCtrl.push(RestaurantsPage);
      }, (err) => {
        console.error(err)
      })
  }
}
