import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";

import {HomePage} from "../pages/home/home";
import {RestaurantsPage} from "../pages/restaurants/restaurants";
import {LoginPage} from "../pages/login/login";
import {RegistryPage} from "../pages/registry/registry";
import {BonusPage} from "../pages/bonus/bonus";
import {ReservationsPage} from "../pages/reservations/reservations";
import {TranslateService} from "@ngx-translate/core";


@Injectable()
export class MenuService {
  public customerPages = [];
  public guestPages = [];

  private home;
  private myOrders;
  private myPoints;
  private login;
  private register;

  constructor(private translate: TranslateService) {
      this.translate.setDefaultLang('de');
      this.translate.get('home').subscribe(
          value => { this.home = value }
      );
      this.translate.get('ReservationsPage.title').subscribe(
          value => { this.myOrders = value }
      );
      this.translate.get('BonusPage.title').subscribe(
          value => { this.myPoints= value }
      );
      this.translate.get('LoginPage.title').subscribe(
          value => { this.login = value }
      );
      this.translate.get('LoginPage.register').subscribe(
          value => { this.register = value }
      );

      setTimeout(() => {
          this.customerPages = [
              {title: this.home, component: HomePage},
              {title: this.myOrders, component: ReservationsPage},
              {title: this.myPoints, component: BonusPage},
              {title: 'Restaurants', component: RestaurantsPage}, //TODO: noch rauszunehmen, gerade nur für debugging
          ];

          this.guestPages = [
              {title: this.home, component: HomePage},
              {title: this.login, component: LoginPage},
              {title: this.register, component: RegistryPage},
              {title: 'Restaurants', component: RestaurantsPage} //TODO: noch rauszunehmen, gerade nur für debugging
          ];
      }, 50)
  }
}
