import {Component, ViewChild} from "@angular/core";
import {Events, Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SERVER_URL} from "../app/app.module";
import {Headers, Http, RequestOptions, RequestMethod} from "@angular/http";
import {AuthService} from "../providers/auth-service";
import {MenuService} from "../providers/menu-service";
import {ToastController} from "ionic-angular";
import {InAppBrowser} from "@ionic-native/in-app-browser";

import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {Firebase} from "@ionic-native/firebase";
import {QRService} from "../providers/QRService";



@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = HomePage;

    pages: Array<{ title: string, component: any }>;
    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        private http: Http,
        public splashScreen: SplashScreen,
        private firebase: Firebase,
        private events: Events,
        private auth: AuthService,
        public menu: MenuService,
        private toastCtrl: ToastController,
        private iab: InAppBrowser,
        public qr: QRService
    ) {
      this.auth.verifyUser();

      //Listener, der bei "pausieren und wieder öffnen" der App loggedIn Status am Server verifiziert
      document.addEventListener('resume', () => {
        this.auth.verifyUser();
      })

    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }

    public logout (){
      this.auth.logout();
      const toast = this.toastCtrl.create({
        message: "Logout erfolgt",
        duration: 3000});
      toast.present();
    }

    onMenuClosed() {
        this.events.publish("menu", "close");
    }

    onMenuOpened() {
        this.events.publish("menu", "open");
    }
  openUrl(url){
    this.platform.ready().then(() => {
      let browser = this.iab.create(url);
    });
  }
}
