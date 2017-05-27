import {Component} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {LoginPage} from "../login/login";


@Component({
  selector: 'registry',
  templateUrl: 'registry.html'
})
export class RegistryPage {
  public user: {
    username: string,
    password: string
  }

  constructor(private http: Http, navParams: NavParams, private toastCtrl: ToastController, private navCtrl: NavController) {
    this.user = {
      username: "",
      password: ""
    }
  }


  private validateCredentials(userName: string, password: string, password2: string) {
    if (password !== password2) {
      alert("Passworteingaben stimmen nicht überein, bitte überprüfen Sie Ihre Eingabe");
      return false;
    } else if (password.length < 6) {
      alert("Passwort muss mindestens 6 Zeichen haben ");
      return false;
    } else if (userName.length < 6) {
      alert("E-Mail Adresse mindestens 6 Zeichen haben");
      return false;
    } else if (userName.indexOf("@") === -1) {
      alert("keine gültige E-Mail Adresse");
      return false;
    }
    else
      return true;
  }

  public onRegisterClicked(username: string, password: string, password2: string) {
    if (this.validateCredentials(username, password, password2)) {
     // alert("geht durch");
       this.user.username = username;
       this.user.password = password;


      let headers = new Headers({
        'Content-Type': 'application/json',
        "Authorization": "Basic aW9uaWNAaW9uaWMuY29tOiExMjM0NTY3OE5p"
      });
      let options = new RequestOptions({ headers: headers });

      this.http.post(SERVER_URL+"/api/register_user", JSON.stringify(this.user), options).subscribe(
        (res) => {
          const toast = this.toastCtrl.create({
            message: "Registrierung erfolgreich! Sie können sich jetzt einloggen",
            duration: 3000
          });
          toast.present();
          this.navCtrl.push(LoginPage);
        }, (err) => {
          alert(err);
          console.error(err.json);
        })
    }
  }
}


