import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {SERVER_URL} from "../app/app.module";
import {Headers, Http, RequestOptions, RequestMethod} from "@angular/http";
import {AuthService} from "../providers/auth-service";
import {MenuService} from "../providers/menu-service";

import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {RestaurantsPage} from '../pages/restaurants/restaurants';
import {Firebase} from "@ionic-native/firebase";
import {OffersPage} from "../pages/offers/offers";
import {LoginPage} from "../pages/login/login";
import {RegistryPage} from "../pages/registry/registry";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = HomePage;
    pages: Array<{ title: string, component: any }>;

    constructor(public platform: Platform, public statusBar: StatusBar, private http: Http,
                public splashScreen: SplashScreen, private firebase: Firebase, private auth : AuthService,
                public menu : MenuService) {

      this.initializeApp();
      //this.setMenuPages();
      this.auth.verifyUser()

      //bei "pausieren und wieder öffnen" der App werden Seiten entprechend des Einlogstatus status angezeigt
      document.addEventListener('resume', () => {
    //    this.setMenuPages();
        this.auth.verifyUser()
      })

    }
      private setMenuPages(){

        this.auth.verifyUser().then(loggedIn => {
          // Kundenpages anzeigen
         // this.pages = this.menu.customerPages;
            /*[
            {title: 'Restaurants', component: RestaurantsPage},
            {title: 'Home', component: HomePage},
            {title: 'List', component: ListPage},
            {title: 'Angebote', component: OffersPage},
            {title: 'Profil', component: RestaurantsPage},//TODO: Profil Bonus und Logout zeigen alle auf Restaurants-seite
            {title: 'Bonus', component: RestaurantsPage}, //TODO: umschreiben sobald seiten da
            {title: 'Logout', component: RestaurantsPage}
          ]
          */
        })
          // Gäste-Pages anzeigen
        .catch (notLoggedIn => {
       //   this.pages = this.menu.guestPages;
          /*[
            {title: 'Restaurants', component: RestaurantsPage},
            {title: 'Home', component: HomePage},
            {title: 'List', component: ListPage},
            {title: 'Angebote', component: OffersPage},
            {title: 'Login', component: LoginPage},
            {title: 'Registrieren', component: RegistryPage}

          ]
          */
        })
      }

        // used for an example of ngFor and navigation



    initializeApp() {
      console.log("zuletzt eingeloggter user aus app.module " + window.localStorage.getItem("username") +
        "\n dazugehöriges token " + window.localStorage.getItem(window.localStorage.getItem("username")) );

      let headers = new Headers({
        'Content-Type': 'application/json',
        "Authorization": "Basic aW9uaWNAaW9uaWMuY29tOiExMjM0NTY3OE5p"
      });
      let options = new RequestOptions({
        headers: headers,
        method: RequestMethod.Put
      });

        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();

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


                /*
                msg.requestPermission()
                      .then(function () {
                        console.log('Notification permission granted.');
                        msg.getToken()
                          .then(function (currentToken) {
                                if (currentToken) {
                                    token = currentToken;
                                    console.log("token 1: "+token);
                                    // sendTokenToServer(currentToken);
                                    // updateUIForPushEnabled(currentToken);

                                    /*
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

                    })
                    .catch(function (err) {
                        console.log('Unable to get permission to notify.', err);
                    });
                */
            }

        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }

    show
}
