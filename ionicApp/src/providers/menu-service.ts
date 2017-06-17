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
    {title: 'Restaurants', component: RestaurantsPage},
    {title: 'Home', component: HomePage},
    {title: 'Bonus', component: BonusPage},
    {title: 'Bestellungen', component: RestaurantsPage},

  ];

  guestPages = [
    {title: 'Restaurants', component: RestaurantsPage},
    {title: 'Home', component: HomePage},
    {title: 'Login', component: LoginPage},
    {title: 'Registrieren', component: RegistryPage},
    {title: 'Password Vergessen', component: RestaurantsPage} //TODO: Entsprechende Page etc anzeigen


  ];

  constructor() {
    console.log('Hello MenuPages Provider');
  }

}
