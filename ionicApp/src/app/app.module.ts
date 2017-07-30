import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";

import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {ListPage} from "../pages/list/list";
import {BonusPage} from "../pages/bonus/bonus";
import {LoginPage} from "../pages/login/login";
import {OrderDetailsPage} from "../pages/orderdetails/orderdetails";
import {RegistryPage} from "../pages/registry/registry";
import {OfferProductDetailsPage} from "../pages/offer-product-details/offer-product-details";
import {RestaurantPage} from "../pages/restaurant/restaurant";
import {ReservationPage} from "../pages/reservation/reservation";
import {AuthService} from "../shared/auth.service";
import {MenuService} from "../shared/menu.service";
import {OffersService} from "../pages/offers/offers.service";
import {ReservationsPage} from "../pages/reservations/reservations";

import {InAppBrowser} from "@ionic-native/in-app-browser";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {OffersPage} from "../pages/offers/offers";
import {CommonModule, DatePipe} from "@angular/common";
import {Http, HttpModule} from "@angular/http";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {QRService} from "../pages/bonus/qr.service";
import {FilterPopoverComponent} from "../pages/home/FilterPopoverComponent";
import {FilterPopoverService} from "../pages/home/FilterPopoverService";
import {AddressInputComponent} from "../pages/home/AddressInputComponent";
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import {CartService} from "../shared/cart.service";
import {Push} from "@ionic-native/push";
import {LoadingService} from "../shared/loading.service";
import {PushService} from "../shared/push.service";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Network} from "@ionic-native/network";
import {FavorizeService} from '../shared/favorize.service';

export const SERVER_URL: string = "https://findlunch.biz.tm:8443";
export const APP_LANG: string = "de";
export const FCM_SENDER_ID: string = '343682752512';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        OffersPage,
        BonusPage,
        OrderDetailsPage,
        FilterPopoverComponent,
        AddressInputComponent,
        OfferProductDetailsPage,
        RestaurantPage,
        LoginPage,
        RegistryPage,
        ReservationsPage,
        ReservationPage

    ],
    imports: [
        CommonModule,
        BrowserModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        }),
        IonicModule.forRoot(MyApp, {
            menuType: 'overlay'
        }),
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        OffersPage,
        BonusPage,
        OrderDetailsPage,
        FilterPopoverComponent,
        AddressInputComponent,
        OfferProductDetailsPage,
        ReservationPage,
        RestaurantPage,
        LoginPage,
        RegistryPage,
        ReservationsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        FilterPopoverService,
        NativeGeocoder,
        OffersService,
        BarcodeScanner,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        QRService,
        CartService,
        Push,
        AuthService,
        MenuService,
        InAppBrowser,
        PushService,
        LoadingService,
        DatePipe,
        Network,
        FavorizeService
    ]

})
export class AppModule {
}
/**
 * Function prepares the loader for the translation service
 * from './assets/i18n/*.json'.
 * @param http
 * @returns {TranslateHttpLoader}
 */
export function createTranslateLoader(http: Http): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
