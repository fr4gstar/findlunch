import {Component, OnInit} from "@angular/core";
import {Loading, NavController} from "ionic-angular";
import {Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {ReservationPage} from "../reservation/reservation";
import {Reservation} from "../../model/Reservation";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../shared/auth.service";
import {LoadingService} from "../../shared/loading.service";
import {Event} from "_debugger";

/**
 * This pages loads and shows all reservation of an user.
 * @author Sergej Bardin & Skanny Morandi
 */
@Component({
    selector: 'reservations-page',
    templateUrl: 'reservations.html'
})
export class ReservationsPage implements OnInit {
    public reservations: Reservation[];
    public usedRestaurants: String[];
    private strConnectionError: string;

    constructor(public navCtrl: NavController,
                private http: Http,
                private auth: AuthService,
                private loading: LoadingService,
                private translate: TranslateService) {
        this.usedRestaurants = [];
    }

    /**
     * Loads the reservation(s) of a user.
     */
    public ngOnInit(): void {
        this.translate.get('Error.connetion').subscribe(
            (value: string) => { this.strConnectionError = value; });

        //prepare a loading spinner
        const loader: Loading = this.loading.prepareLoader();
        loader.present();

        //put together the options for http-call
        const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Get);
        this.http.get(`${SERVER_URL}/api/getCustomerReservations`, options)
            .retry(2)
            .subscribe(
                (res: Response) => {
                    this.reservations = res.json();
                    if (this.reservations.length > 0) {
                        this.collectUsedRestaurants();
                        ReservationsPage.sortByCollectTime(this.reservations);
                    }
                    loader.dismiss();
                },
                (err: Error) => {
                    console.error(err);
                    alert();
                    loader.dismiss();
                }
            );
    }

    // TODO
    public collectUsedRestaurants(): void {
        for (const reservation of this.reservations) {
            if (this.usedRestaurants.indexOf(reservation.restaurant.name) === -1) {
                this.usedRestaurants.push(reservation.restaurant.name);
            }
        }
    }

    /**
     * Opens a reservation detail view on click.
     * @param event
     * @param reservation
     */
    public onReservationClicked(event: Event, reservation: String): void {
        this.navCtrl.push(ReservationPage, {reservation: reservation});
    }
    // TODO
    private static sortByCollectTime(reservations: Reservation[]): void {
        reservations.sort((a, b) => {
            if (a.collectTime > b.collectTime) { return -1; }
            if (b.collectTime > a.collectTime) { return 1; }
            return 0;
        });
    }
}
