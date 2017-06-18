import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {HomePage} from '../pages/home/home';
import {RestaurantsPage} from '../pages/restaurants/restaurants';
import {LoginPage} from "../pages/login/login";
import {RegistryPage} from "../pages/registry/registry";
import {BonusPage} from "../pages/bonus/bonus";


@Injectable()
export class MenuService {
  customerPages = [
    {title: 'Home', component: HomePage},
    {title: 'Meine Bestellungen', component: RestaurantsPage},//TODO: noch anzulegen
    {title: 'Meine Bonuspunkte', component: BonusPage},
    {title: 'Restaurants', component: RestaurantsPage}, //TODO: noch rauszunehmen, gerade nur für debugging

  ];

  guestPages = [
    {title: 'Home', component: HomePage},
    {title: 'Login', component: LoginPage},
    {title: 'Registrieren', component: RegistryPage},
    {title: 'Password Vergessen', component: RestaurantsPage}, //TODO: Entsprechende Page etc anzeigen
    {title: 'Restaurants', component: RestaurantsPage} //TODO: noch rauszunehmen, gerade nur für debugging


  ];

  constructor() {
    console.log('Hello MenuPages Provider');
  }

}
