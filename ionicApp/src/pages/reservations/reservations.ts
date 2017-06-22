import {AfterContentInit, Component, OnInit} from "@angular/core";
import {NavController, NavParams, Platform} from "ionic-angular";
import {Headers, Http, RequestMethod, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {OffersPage} from "../offers/offers";
import {ReservationViewPage} from "../reservation-view/reservation-view";
import {Observable} from "rxjs/Observable";
import {Reservation} from "../../model/Reservation";
import {Restaurant} from "../../model/Restaurant";


@Component({
  selector: 'reservations-page',
  templateUrl: 'reservations.html'
})
export class ReservationsPage implements OnInit {
  public reservations$;
  public restaurants = new Set();

  constructor(
    public navCtrl : NavController,
    private navParams: NavParams,
    private http: Http,
    private platform: Platform) {
  }

  ngOnInit() {
    let user = window.localStorage.getItem("username");
    let token = window.localStorage.getItem(user);
    let headers = new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic " +token
    });

    let options = new RequestOptions({
      headers: headers,
      method: RequestMethod.Get
    });
    this.http.get(`${SERVER_URL}/api/getCustomerReservations`, options)
      .subscribe(
        res =>
          this.reservations$ = res.json(),
        err => console.error(err)

      );
  }

 public onReservationClicked(event, reservation: String){
    this.navCtrl.push(ReservationViewPage,{reservation: reservation});
 }

}
