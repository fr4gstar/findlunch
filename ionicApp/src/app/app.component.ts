import {Component, ViewChild} from "@angular/core";
import {AlertController, Events, Nav, Platform, ToastController} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {AuthService} from "../shared/auth.service";
import {MenuService} from "../shared/menu.service";
import {QRService} from "../pages/bonus/qr.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {EVENT_TOPIC_MAP_CLICKABLE, HomePage} from "../pages/home/home";
import {PushService} from "../shared/push.service";
import {TranslateService} from "@ngx-translate/core";
import {SERVER_URL} from "../app/app.module";

/**
 * Initialize the application.
 * 1. Verifies the user from the local storage.
 * 2. Sets the firebase-functionality of the application up.
 * 3. Shows the Page listings for navigation according to login status of the user
 * @author Skanny Morandi
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
    private logoutSuccessMsg :string;
    pages: Array<{ title: string, component: any }>;


    constructor(public platform: Platform,
                public statusBar: StatusBar,
                public splashScreen: SplashScreen,
                private events: Events,
                private auth: AuthService,
                public menu: MenuService,
                private toastCtrl: ToastController,
                public qr: QRService,
                public iab: InAppBrowser,
                private push: PushService,
                private translate: TranslateService) {

        //TODO: export languge to variable that is imported to all classes
        translate.setDefaultLang('de');


        //TODO verifyUser und pushsetup and translate.get  methods in OnInit
        this.auth.verifyUser();
        this.push.pushSetup();

        this.translate.get('Success.logoutSuccessMsg').subscribe(
            value => { this.logoutSuccessMsg = value }
        );

       document.addEventListener('resume', () => {
            this.auth.verifyUser();
            this.push.pushSetup();
        })

    }

    /**
     * opens the clicked page. Reset the content nav to have just this page.
     * @param page
     *  the page the user clicked
     */
    openPage(page) {
        if(page !== null){
            this.nav.setRoot(page.component);
        }
    }

    /**
     * Logs the user out. After that a toast is shown that logout was successful.
     * After logout view gets sent back to rootPage.
     */
    public logout() {
        this.auth.logout();

        const toast = this.toastCtrl.create({
            message: this.logoutSuccessMsg,
            duration: 3000
        });
        toast.present();

        this.openPage(this.rootPage);
    }

    /**
     * TODO: replace generic comment
     * Handles on menu closed action
     */
    onMenuClosed() {
        this.events.publish(EVENT_TOPIC_MAP_CLICKABLE, true);
    }

    /**
     * TODO: replace generic comment
     * Handles on menu opened action
     */
    onMenuOpened() {
        this.events.publish(EVENT_TOPIC_MAP_CLICKABLE, false);
    }

    /**
     * Opens a url in the inapp browser
     * @param url
     */
    openUrl(url) {
        if(url !== null){
            this.platform.ready().then(() => {
                //TODO: test whether this works without browser object
                let browser = this.iab.create(url);
            });
        }
    }

    /**
     * opens in app browser on about url
     */
    goToImpressum() {
        this.openUrl(`${SERVER_URL}/api/confirm_reservation/about_findlunch`);
    }

    /**
     *  opens in app browser on Faq url
     */
    goToFaq() {
        this.openUrl(`${SERVER_URL}/api/confirm_reservation/faq_customer`);

    }

}

