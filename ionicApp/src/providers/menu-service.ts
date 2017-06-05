import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {HomePage} from '../pages/home/home';
import {RestaurantsPage} from '../pages/restaurants/restaurants';
import {OffersPage} from "../pages/offers/offers";
import {LoginPage} from "../pages/login/login";
import {RegistryPage} from "../pages/registry/registry";


@Injectable()
export class MenuService {
  customerPages = [
    {title: 'Restaurants', component: RestaurantsPage},
    {title: 'Home', component: HomePage},
    {title: 'Angebote', component: OffersPage},
    {title: 'Profil', component: RestaurantsPage},//TODO: Profil Bonus und Logout zeigen alle auf Restaurants-seite
    {title: 'Bonus', component: RestaurantsPage}, //TODO: umschreiben sobald seiten da
    {title: 'Bestellungen', component: RestaurantsPage},

  ];

  guestPages = [
    {title: 'Restaurants', component: RestaurantsPage},
    {title: 'Home', component: HomePage},
    {title: 'Angebote', component: OffersPage},
    {title: 'Login', component: LoginPage},
    {title: 'Registrieren', component: RegistryPage},
    {title: 'Password Vergessen', component: RestaurantsPage} //TODO: Entsprechende Page etc anzeigen


  ];

  constructor() {
    console.log('Hello MenuPages Provider');
  }

}
