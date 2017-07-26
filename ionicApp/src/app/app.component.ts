import {Component, OnInit, ViewChild} from "@angular/core";
import {AlertController, Events, Nav, Platform, Toast, ToastController} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {AuthService} from "../shared/auth.service";
import {MenuService} from "../shared/menu.service";
import {QRService} from "../pages/bonus/qr.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {EVENT_TOPIC_MAP_CLICKABLE, HomePage} from "../pages/home/home";
import {PushService} from "../shared/push.service";
import {TranslateService} from "@ngx-translate/core";
import {SERVER_URL, APP_LANG} from "../app/app.module";

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


export class MyApp implements OnInit{
    @ViewChild(Nav) nav: Nav;
    /**
     * Sets the first site of the app
     * @type {HomePage}
     */
    rootPage: any = HomePage;
    private strLogoutSuccess: string;
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
        translate.setDefaultLang(APP_LANG);
    }

    public ngOnInit(): void {
        this.auth.verifyUser();
        this.push.pushSetup();

        this.translate.get('Success.logoutSuccessMsg').subscribe(
            (value: string) => { this.strLogoutSuccess = value; }
        );

        document.addEventListener('resume', () => {
            this.auth.verifyUser();
            this.push.pushSetup();
        });
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
    public logout(): void {
        this.auth.logout();

        const toast: Toast = this.toastCtrl.create({
            message: this.strLogoutSuccess,
            duration: 3000
        });
        toast.present();

        this.openPage(this.rootPage);
    }

    /**
     * TODO: replace generic comment
     * Handles on menu closed action
     */
    public onMenuClosed(): void {
        this.events.publish(EVENT_TOPIC_MAP_CLICKABLE, true);
    }

    /**
     * TODO: replace generic comment
     * Handles on menu opened action
     */
    public onMenuOpened(): void {
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
    public goToImprint(): void {
        this.openUrl(`${SERVER_URL}/api/confirm_reservation/about_findlunch`);
    }

    /**
     *  opens in app browser on Faq url
     */
    public goToFaq(): void {
        this.openUrl(`${SERVER_URL}/api/confirm_reservation/faq_customer`);

    }

}

