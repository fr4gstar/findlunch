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
import {Observable} from "rxjs";

/**
 *  Preparing the menu pages
 * @Skanny Morandi & Sergej Bardin & David Sautter
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

        Observable.forkJoin(
            this.translate.get('home')
                .map((value: string) => {
                    this.strHome = value;
                })
                .catch((err: Error) => {
                        console.error("Error: translate.get did fail for key home.", err);
                        return Observable.of("Home");
                    }
                ),
            this.translate.get('ReservationsPage.title')
                .map((value: string) => {
                    this.strMyOrders = value;
                })
                .catch((err: Error) => {
                        console.error("Error: translate.get did fail for key ReservationsPage.title.", err);
                        return Observable.of("Reservations");
                    }
                ),
            this.translate.get('BonusPage.title')
                .map((value: string) => {
                    this.strMyPoints = value;
                })
                .catch((err: Error) => {
                        console.error("Error: translate.get did fail for key BonusPage.title.", err);
                        return Observable.of("Bonus");
                    }
                ),
            this.translate.get('LoginPage.title')
                .map((value: string) => {
                    this.strLogin = value;
                })
                .catch((err: Error) => {
                        console.error("Error: translate.get did fail for key LoginPage.title.", err);
                        return Observable.of("Login");
                    }
                ),
            this.translate.get('LoginPage.register')
                .map((value: string) => {
                    this.strRegister = value;
                })
                .catch((err: Error) => {
                    console.error("Error: translate.get did fail for key LoginPage.register.", err);
                    return Observable.of("Register");
                })
        ).subscribe(() => {
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
        });
    }
}
