import {Component, ViewChild} from "@angular/core";
import {AlertController, Events, Nav, Platform, ToastController} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SERVER_URL} from "../app/app.module";
import {Headers, Http, RequestMethod, RequestOptions} from "@angular/http";
import {AuthService} from "../providers/auth-service";
import {MenuService} from "../providers/menu-service";
import {Push, PushObject, PushOptions} from "@ionic-native/push";
import {QRService} from "../providers/QRService";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {EVENT_TOPIC_MAP_CLICKABLE, HomePage} from "../pages/home/home";

/**
 * Initialize the application.
 * 1. Verifies the user from the local storage.
 * 2. Sets the firebase-functionality of the application up.
 */
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    /**
     * Sets the first site of the app
     * @type {HomePage}
     */
    rootPage: any = HomePage;

    pages: Array<{ title: string, component: any }>;

    /**
     * Initialize modules.
     * 1. Verify user
     * 2. Push setup - firebase
     *
     * @param platform
     * @param statusBar
     * @param http
     * @param splashScreen
     * @param events
     * @param auth
     * @param menu
     * @param toastCtrl
     * @param push
     * @param qr
     * @param iab
     * @param alertCtrl
     */
    constructor(public platform: Platform,
                public statusBar: StatusBar,
                private http: Http,
                public splashScreen: SplashScreen,
                private events: Events,
                private auth: AuthService,
                public menu: MenuService,
                private toastCtrl: ToastController,
                public push: Push,
                public qr: QRService,
                public iab: InAppBrowser,
                public alertCtrl: AlertController) {

        this.auth.verifyUser();
        this.pushSetup();

        //Listener, der bei "pausieren und wieder öffnen" der App loggedIn Status am Server verifiziert
        document.addEventListener('resume', () => {
            this.auth.verifyUser();
        })

    }


  onMenuOpened() {
    this.events.publish("menu", "open");
  }
   openUrl(url){
    this.platform.ready().then(() => {
       this.iab.create(url);
    });
  }

  goToImpressum(){
       this.openUrl("https://shrouded-dusk-87807.herokuapp.com/about_findlunch");
  }

  goToFaq(){
      this.openUrl("https://shrouded-dusk-87807.herokuapp.com/faq_customer");

  }

}
