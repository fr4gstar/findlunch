import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";

import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {ListPage} from "../pages/list/list";
import {RestaurantsPage} from "../pages/restaurants/restaurants";
import {BonusPage} from "../pages/bonus/bonus";
import {LoginPage} from "../pages/login/login";
import {OrderDetailsPage} from "../pages/order-details/orderdetails";
import {RegistryPage} from "../pages/registry/registry";
import {OffersProductViewPage} from "../pages/offers-product-view/offers-product-view";
import {RestaurantViewPage} from "../pages/restaurant-view/restaurant-view";
import {AuthService} from "../providers/auth-service";
import {MenuService} from "../providers/menu-service";
import {OffersService} from "../pages/offers/OffersService";
import {ReservationsPage} from "../pages/reservations/reservations";
import {ReservationViewPage} from "../pages/reservation-view/reservation-view";

import {InAppBrowser} from "@ionic-native/in-app-browser";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Geolocation} from "@ionic-native/geolocation";
import {OffersPage} from "../pages/offers/offers";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {QRService} from "../providers/QRService";
import {FilterPopoverComponent} from "../pages/home/FilterPopoverComponent";
import {FilterPopoverService} from "../pages/home/FilterPopoverService";
import {AddressInputComponent} from "../pages/home/AddressInputComponent";
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import {CartService} from "../services/CartService";
import {Push} from "@ionic-native/push";
import {LoadingService} from "../providers/loading-service"


// online Server:
// export const SERVER_URL = "https://findlunch.biz.tm:8444";

// for web app
// export const SERVER_URL = "https://localhost:8443";

// please Change this to the respective Server
export const SERVER_URL = "https://shrouded-dusk-87807.herokuapp.com";
// export const SERVER_URL = "https://192.168.178.38:8443";


@NgModule({
    declarations: [
        MyApp,
        HomePage,
        OffersPage,
        BonusPage,
        RestaurantsPage,
        OrderDetailsPage,
        FilterPopoverComponent,
        AddressInputComponent,
        OffersProductViewPage,
        RestaurantViewPage,
        LoginPage,
        RegistryPage,
        ReservationsPage,
        ReservationViewPage

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
        OffersPage,
        BonusPage,
        RestaurantsPage,
        OrderDetailsPage,
        FilterPopoverComponent,
        AddressInputComponent,
        OffersProductViewPage,
        RestaurantViewPage,
        LoginPage,
        RegistryPage,
        ReservationsPage,
        ReservationViewPage
    ],
    providers: [
        StatusBar,
        Geolocation,
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
        LoadingService
    ]

})
export class AppModule {
}
