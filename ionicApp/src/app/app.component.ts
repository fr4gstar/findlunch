import {Component, ViewChild} from "@angular/core";
import {Events, Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SERVER_URL} from "../app/app.module";
import {Headers, Http, RequestOptions, RequestMethod} from "@angular/http";
import {AuthService} from "../providers/auth-service";
import {MenuService} from "../providers/menu-service";
import {ToastController, AlertController} from "ionic-angular";
import {Push, PushObject, PushOptions} from '@ionic-native/push';
import {QRService} from "../providers/QRService";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {HomePage} from '../pages/home/home';

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

  /**
   * Sets the firebase push configuration up.
   * Register the device token at the backend.
   * If the device receives a push message,
   * it will be displayed as a notification.
   */
  pushSetup() {
    let user = window.localStorage.getItem("username");
    let token = window.localStorage.getItem(user);
    let headers = new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic " +token
    });

    let options = new RequestOptions({
      headers: headers,
      method: RequestMethod.Put
    });

    const pushOptions: PushOptions = {
      android: {
        senderID: '343682752512',
        icon: '',
        vibrate: true
      },
      ios: {
        alert: 'false',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(pushOptions);

    pushObject.on('notification')
      .subscribe((notification: any) => {

        // Foreground handling
        if (notification.additionalData.foreground) {
          let youralert = this.alertCtrl.create({
            title: notification.title,
            message: notification.message,
            buttons: [{
              text: 'Okay',
              role: 'cancel'
            }],
          });
          youralert.present();
        }
      });

    pushObject.on('registration')
      .subscribe((registration: any) => {
        this.http.get(`${SERVER_URL}/api/submitToken/${registration.registrationId}`, options)
          .subscribe(
            res => res,
            err => console.error(err)
          )
      });

    pushObject.on('error').subscribe(error => console.log('Error with Push plugin' + error));
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  public logout() {
    this.auth.logout();
    const toast = this.toastCtrl.create({
      message: "Logout erfolgt",
      duration: 3000
    });
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
