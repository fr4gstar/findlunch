import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";

import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {ListPage} from "../pages/list/list";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Firebase} from "@ionic-native/firebase";
import {Geolocation} from "@ionic-native/geolocation";
import {OffersPage} from "../pages/offers/offers";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ListPage,
        OffersPage
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
        OffersPage
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
