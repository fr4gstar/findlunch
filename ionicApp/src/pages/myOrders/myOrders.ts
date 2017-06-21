import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {AuthService} from "../../providers/auth-service";
/**
 * This page shows  information about past and pending Orders of the
 * logged in user.
 */
@Component({
  selector: 'myOrderspage',
  templateUrl: 'myOrders.html'

})
export class MyOrdersPage {


  constructor(

    private navParams:NavParams,
    private auth: AuthService) {

  }
}
