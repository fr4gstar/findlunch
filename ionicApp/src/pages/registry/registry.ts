import {Component} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {NavController, NavParams, ToastController} from "ionic-angular";


@Component({
  selector: 'registry',
  templateUrl: 'registry.html'
})
export class RegistryPage {

  constructor(private http: Http, navParams: NavParams, private toastCtrl: ToastController, private navCtrl: NavController) {
  }


};
