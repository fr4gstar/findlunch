import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {ModalController} from "ionic-angular";
import {Headers, Http, RequestOptions, RequestMethod} from "@angular/http";
import {HomePage} from "../home/home";
import {RegistryPage} from "../registry/registry";
import {AuthService} from "../../providers/auth-service";
import {SERVER_URL} from "../../app/app.module";

@Component({
  selector: 'login-page',
  templateUrl: 'login.html'

})
export class LoginPage {

  toPop : boolean

  constructor(
      private navCtrl: NavController,
      private toastCtrl: ToastController,
      private auth: AuthService,
      private http: Http,
      private navParams: NavParams) {

    this.toPop = navParams.get("comeback");
  }


  public login(userName: string, password: string) {
    this.auth.login(userName, password).then(data => {
      if (data) {
        const toast = this.toastCtrl.create({
          message: "Login Erfolgreich",
          duration: 3000
        });
        toast.present();
        if(this.toPop){
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
  public sendPasswordReset(){
    let user = window.localStorage.getItem("username");
    let token = window.localStorage.getItem(user);
    let headers = new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic " +token
    });

    let options = new RequestOptions({
      headers: headers,
      method: RequestMethod.Post
    });
    this.http.get(`${SERVER_URL}/api/api/get_reset_token`, options)
      .subscribe(
        (res) => {
          let msg;
          switch (res.json()){
            case 0:
              msg = "Eine E-Mail mit der Passwortwiederherstellung wurde an Sie gesandt!"
              break;
            default:
              msg = "Verbindungsfehler!"
              break;
          }
          const toast = this.toastCtrl.create({
            message: msg,
            duration: 3000});
          toast.present();
        }, (err) => {
          console.error(err)
        }
      )
  }

}
