import {Injectable, OnInit} from "@angular/core";
import "rxjs/add/operator/map";

import {HomePage} from "../pages/home/home";
import {LoginPage} from "../pages/login/login";
import {RegistryPage} from "../pages/registry/registry";
import {BonusPage} from "../pages/bonus/bonus";
import {ReservationsPage} from "../pages/reservations/reservations";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class MenuService {
  public customerPages = [];
  public guestPages = [];

  private strHome: string;
  private strMyOrders: string;
  private strMyPoints: string;
  private strLogin: string;
  private strRegister: string;

  constructor(private translate: TranslateService) {
      this.translate.setDefaultLang('de');
      this.translate.get('home').subscribe(
          (value: string) => { this.strHome = value; }
      );
      this.translate.get('ReservationsPage.title').subscribe(
          (value: string) => { this.strMyOrders = value; }
      );
      this.translate.get('BonusPage.title').subscribe(
          (value: string) => { this.strMyPoints = value; }
      );
      this.translate.get('LoginPage.title').subscribe(
          (value: string) => { this.strLogin = value; }
      );
      this.translate.get('LoginPage.register').subscribe(
          (value: string) => { this.strRegister = value; }
      );

      setTimeout(() => {
          this.customerPages = [
              {title: this.strHome, component: HomePage},
              {title: this.strMyOrders, component: ReservationsPage},
              {title: this.strLogin, component: BonusPage}
          ];

          this.guestPages = [
              {title: this.strHome, component: HomePage},
              {title: this.strLogin, component: LoginPage},
              {title: this.strRegister, component: RegistryPage}
          ];
      },         50);
  }
}
