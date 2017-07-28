import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {APP_LANG} from "../app/app.module";
import {HomePage} from "../pages/home/home";
import {LoginPage} from "../pages/login/login";
import {RegistryPage} from "../pages/registry/registry";
import {BonusPage} from "../pages/bonus/bonus";
import {ReservationsPage} from "../pages/reservations/reservations";
import {TranslateService} from "@ngx-translate/core";
import {MenuPage} from "../model/MenuPage";
/**
 *  Preparing the menu pages
 * @Skanny Morandi & Sergej Bardin
 */
@Injectable()
export class MenuService {
  public customerPages: MenuPage [];
  public guestPages: MenuPage [];

  private strHome: string;
  private strMyOrders: string;
  private strMyPoints: string;
  private strLogin: string;
  private strRegister: string;

  constructor(private translate: TranslateService) {
      this.translate.setDefaultLang(APP_LANG);
      this.translate.get('home').subscribe(
          (value: string) => {
              this.strHome = value;
          },
          (err: Error) => {
              console.error("Error: translate.get did fail for key home.", err);
          }
      );
      this.translate.get('ReservationsPage.title').subscribe(
          (value: string) => {
              this.strMyOrders = value;
              },
          (err: Error) => {
              console.error("Error: translate.get did fail for key ReservationsPage.title.", err);
          }
      );
      this.translate.get('BonusPage.title').subscribe(
          (value: string) => {
              this.strMyPoints = value;
              },
          (err: Error) => {
              console.error("Error: translate.get did fail for key BonusPage.title.", err);
          }
      );
      this.translate.get('LoginPage.title').subscribe(
          (value: string) => {
              this.strLogin = value;
              },
          (err: Error) => {
              console.error("Error: translate.get did fail for key LoginPage.title.", err);
          }
      );
      this.translate.get('LoginPage.register').subscribe(
          (value: string) => {
              this.strRegister = value;
              },
          (err: Error) => {
              console.error("Error: translate.get did fail for key LoginPage.register.", err);
          }
      );
      // TODO @David
      // Timeout is needed because of async translation without promise
      setTimeout(() => {
          this.customerPages = [
              {title: this.strHome, component: HomePage},
              {title: this.strMyOrders, component: ReservationsPage},
              {title: this.strMyPoints, component: BonusPage}
          ];

          this.guestPages = [
              {title: this.strHome, component: HomePage},
              {title: this.strLogin, component: LoginPage},
              {title: this.strRegister, component: RegistryPage}
          ];
      },         50);
  }
}
