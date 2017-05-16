import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { RestaurantsPage } from '../pages/restaurants/restaurants' ;

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Firebase} from "@ionic-native/firebase";
import {Geolocation} from "@ionic-native/geolocation";
import {OffersPage} from "../pages/offers/offers";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";

// online Server:
// export const SERVER_URL = "https://findlunch.biz.tm:8444";

// for web app
// export const SERVER_URL = "https://localhost:8443";

// please Change this to the respective Server
export const SERVER_URL = "https://192.168.0.12:8443";

@NgModule({
     declarations: [
        MyApp,
        HomePage,
        ListPage,
        OffersPage,
       RestaurantsPage
    ],
    imports: [
        CommonModule,
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ListPage,
        OffersPage,
        RestaurantsPage
    ],
    providers: [
        StatusBar,
        Firebase,
        Geolocation,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]

})
export class AppModule {
}
