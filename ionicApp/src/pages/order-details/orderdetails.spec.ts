import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AlertController, IonicErrorHandler, IonicModule, NavController, NavParams, Platform} from "ionic-angular";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {PlatformMock, SplashScreenMock, StatusBarMock} from "../../../test-config/mocks-ionic";
import {Http, HttpModule} from "@angular/http";
import {CommonModule, DatePipe} from "@angular/common";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {ErrorHandler} from "@angular/core";
import {OffersService} from "../offers/offers.service";
import {CartService} from "../../shared/cart.service";
import {LoadingService} from "../../shared/loading.service";
import {AuthService} from "../../shared/auth.service";
import {OrderDetailsPage} from "./orderdetails";
import Spy = jasmine.Spy;

describe('OrderDetailsPage', () => {

    let fixture: ComponentFixture<OrderDetailsPage>;
    let component: OrderDetailsPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OrderDetailsPage],
            imports: [
                CommonModule,
                HttpModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (createTranslateLoader),
                        deps: [Http]
                    }
                }),
                IonicModule.forRoot(OrderDetailsPage)
            ],
            providers: [
                {provide: StatusBar, useClass: StatusBarMock},
                {provide: SplashScreen, useClass: SplashScreenMock},
                {provide: Platform, useClass: PlatformMock},
                {provide: ErrorHandler, useClass: IonicErrorHandler},
                AuthService,
                OffersService,
                CartService,
                LoadingService,
                DatePipe,
                NavController,
                AlertController,
                {provide: NavParams, useClass: NavParamsMock}
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OrderDetailsPage);
        component = fixture.componentInstance;
    });


    /***************************************
     * Increment Donation
     */

    it('should not increment the donation if totalPrice is negative', () => {
        const consoleSpy: Spy = spyOn(console, "error");
        component.reservation.totalPrice = -1.10;
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.0);
        expect(component.reservation.totalPrice).toBe(-1.10);
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should not increment the donation if donation is negative and reset the donation to zero', () => {
        const consoleSpy: Spy = spyOn(console, "error");
        component.reservation.totalPrice = 1;
        component.reservation.donation = -1;
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0);
        expect(component.reservation.totalPrice).toBe(1);
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should increment the donation once from 0 to 0.10', () => {
        component.reservation.totalPrice = 0;
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.10);
        expect(component.reservation.totalPrice).toBe(0.10);
    });

    it('should increment the donation once from 0.09 to 0.10', () => {
        component.reservation.totalPrice = 0.09;
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.01);
        expect(component.reservation.totalPrice).toBe(0.10);
    });

    it('should increment the donation once from 0.10 to 0.20', () => {
        component.reservation.totalPrice = 0.10;
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.10);
        expect(component.reservation.totalPrice).toBe(0.20);
    });

    it('should increment the donation once from 0.99 to 1.00', () => {
        component.reservation.totalPrice = 0.99;
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.01);
        expect(component.reservation.totalPrice).toBe(1.00);
    });

    it('should increment the donation once from 9.99 to 10.00', () => {
        component.reservation.totalPrice = 9.99;
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.01);
        expect(component.reservation.totalPrice).toBe(10.00);
    });

    it('should increment the donation once from 99.90 to 100.00', () => {
        component.reservation.totalPrice = 99.90;
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.10);
        expect(component.reservation.totalPrice).toBe(100.00);
    });


    it('should increment the donation two times from 0 to 0.20', () => {
        component.reservation.totalPrice = 0;
        component.incrementDonation();
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.20);
        expect(component.reservation.totalPrice).toBe(0.20);
    });

    it('should increment the donation two times from 0.09 to 0.20', () => {
        component.reservation.totalPrice = 0.09;
        component.incrementDonation();
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.11);
        expect(component.reservation.totalPrice).toBe(0.20);
    });

    it('should increment the donation two times from 0.10 to 0.30', () => {
        component.reservation.totalPrice = 0.10;
        component.incrementDonation();
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.20);
        expect(component.reservation.totalPrice).toBe(0.30);
    });

    it('should increment the donation two times from 0.99 to 1.10', () => {
        component.reservation.totalPrice = 0.99;
        component.incrementDonation();
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.11);
        expect(component.reservation.totalPrice).toBe(1.10);
    });

    it('should increment the donation two times from 9.99 to 10.10', () => {
        component.reservation.totalPrice = 9.99;
        component.incrementDonation();
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.11);
        expect(component.reservation.totalPrice).toBe(10.10);
    });

    it('should increment the donation two times from 99.90 to 100.10', () => {
        component.reservation.totalPrice = 99.90;
        component.incrementDonation();
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.20);
        expect(component.reservation.totalPrice).toBe(100.10);
    });

    // test case for https://redmine.cs.hm.edu/issues/8131
    it('should increment the donation three times from 0.85 to 1.10', () => {
        component.reservation.totalPrice = 0.85;
        component.incrementDonation();
        component.incrementDonation();
        component.incrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.25);
        expect(component.reservation.totalPrice).toBe(1.10);
    });


    /***************************************
     * Decrement Donation
     */

    it('should not decrement the donation if totalPrice is negative', () => {
        const consoleSpy: Spy = spyOn(console, "error");
        component.reservation.totalPrice = -1.10;
        component.decrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.0);
        expect(component.reservation.totalPrice).toBe(-1.10);
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should not decrement the donation if donation is negative and reset the donation to zero', () => {
        const consoleSpy: Spy = spyOn(console, "error");
        component.reservation.totalPrice = 1;
        component.reservation.donation = -1;
        component.decrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0);
        expect(component.reservation.totalPrice).toBe(1);
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should alert if totalPrice < donation', () => {
        const consoleSpy: Spy = spyOn(console, "error");
        const alertSpy: Spy = spyOn(window, "alert");
        component.reservation.totalPrice = 1.10;
        component.reservation.donation = 1.11;
        component.decrementDonation();
        fixture.detectChanges();
        expect(consoleSpy).toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalled();
    });

    it('should not decrement the donation from 0 to under 0', () => {
        component.reservation.totalPrice = 0;
        component.decrementDonation();
        component.decrementDonation();
        component.decrementDonation();
        component.decrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.0);
        expect(component.reservation.totalPrice).toBe(0.0);
    });

    it('should decrement the donation once from 0.01 to 0', () => {
        component.reservation.totalPrice = 1.01;
        component.reservation.donation = 0.01;
        component.decrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.0);
        expect(component.reservation.totalPrice).toBe(1.00);
    });

    it('should decrement the donation once from 0.09 to 0', () => {
        component.reservation.totalPrice = 1.01;
        component.reservation.donation = 0.09;
        component.decrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.0);
        expect(component.reservation.totalPrice).toBe(0.92);
    });

    it('should decrement the donation once from 0.10 to 0', () => {
        component.reservation.totalPrice = 1.01;
        component.reservation.donation = 0.10;
        component.decrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.0);
        expect(component.reservation.totalPrice).toBe(0.91);
    });

    it('should decrement the donation once from 1.01 to 0.91', () => {
        component.reservation.totalPrice = 1.10;
        component.reservation.donation = 1.01;
        component.decrementDonation();
        fixture.detectChanges();
        expect(component.reservation.donation).toBe(0.91);
        expect(component.reservation.totalPrice).toBe(1.00);
    });

});

class NavParamsMock {
    // noinspection TsLint
    public restaurant: any = {
        "id": 101,
        "city": "München",
        "email": "restaurant@ionic.com",
        "locationLatitude": 48.1543,
        "locationLongitude": 11.5569,
        "name": "Ionic Cafe",
        "phone": "0000",
        "street": "Lothstraße",
        "streetNumber": "64",
        "url": "",
        "zip": "80335",
        "country": {"name": "Deutschland"},
        "kitchenTypes": [{"id": 1, "name": "Italienisch"}, {"id": 3, "name": "Griechisch"}, {
            "id": 5,
            "name": "Bayerisch"
        }],
        "restaurantType": null,
        "timeSchedules": [{
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 1, "dayNumber": 2, "name": "Montag"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 2, "dayNumber": 3, "name": "Dienstag"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 3, "dayNumber": 4, "name": "Mittwoch"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 4, "dayNumber": 5, "name": "Donnerstag"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 5, "dayNumber": 6, "name": "Freitag"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 6, "dayNumber": 7, "name": "Samstag"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 7, "dayNumber": 1, "name": "Sonntag"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 1, "dayNumber": 2, "name": "Montag"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 2, "dayNumber": 3, "name": "Dienstag"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 3, "dayNumber": 4, "name": "Mittwoch"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:01",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:01"}],
            "dayOfWeek": {"id": 4, "dayNumber": 5, "name": "Donnerstag"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 5, "dayNumber": 6, "name": "Freitag"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 6, "dayNumber": 7, "name": "Samstag"}
        }, {
            "offerEndTime": "02.01.1970 00:59",
            "offerStartTime": "01.01.1970 01:00",
            "openingTimes": [{"closingTime": "02.01.1970 00:59", "openingTime": "01.01.1970 01:00"}],
            "dayOfWeek": {"id": 7, "dayNumber": 1, "name": "Sonntag"}
        }],
        "defaultLogo": {
            "id": 4,
            "logo": null,
            "thumbnail": null
        },
        "distance": 63,
        "isFavorite": true,
        "actualPoints": 257,
        "currentlyOpen": true
    };

    // noinspection TsLint
    public get() {
        return this.restaurant;
    }
}
