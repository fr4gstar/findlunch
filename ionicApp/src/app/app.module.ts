import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { Restaurants } from '../pages/restaurant/restaurants' ;

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Firebase} from "@ionic-native/firebase";
import { Geolocation } from '@ionic-native/geolocation';
import {RestaurantsPage} from "../pages/restaurants/restaurants";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    RestaurantsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
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
export class AppModule {}
