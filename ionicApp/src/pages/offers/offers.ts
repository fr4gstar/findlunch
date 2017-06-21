import {Component, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {OffersService} from "./OffersService";
import {OffersProductViewPage} from "../offers-product-view/offers-product-view";
import {AuthService} from "../../providers/auth-service";
import {OrderDetailsPage} from "../order-details/orderdetails";
import {Restaurant} from "../../model/Restaurant";
import {RestaurantViewPage} from "../restaurant-view/restaurant-view";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";


/**
 * Page for showing the offers of a specific restaurant in a list.
 * If the user clicks on an offer, she will get to the detail view of this offer.
 */
@Component({
    templateUrl: 'offers.html'
})
export class OffersPage implements OnInit {
    public restaurant: Restaurant;
    public offers: any;
    public categories;
    shownGroup = null;

  allergenics$: Observable<any>;
  additives$: Observable<any>;

  constructor(navParams: NavParams,
              private offerService: OffersService,
              private navCtrl: NavController,
              private http: Http
  ) {
    this.restaurant = navParams.get("restaurant");
  }

  ngOnInit() {
    this.offerService.getOffers(this.restaurant.id).subscribe(
      offers => {
        this.offers = offers;
        console.debug(offers);
        this.categories = Object.keys(offers);
      },
      err => console.error(err)
    );

    this.allergenics$ = this.http.get(SERVER_URL + "/api/all_allergenic").map(res => res.json());
    this.additives$ = this.http.get(SERVER_URL + "/api/all_additives").map(res => res.json());
  }

    public onOfferClicked(event, offer) {
        this.navCtrl.push(OffersProductViewPage, {offer, restaurant: this.restaurant})
    }

  public onRestaurantClicked(event) {
    this.navCtrl.push(RestaurantViewPage, {restaurant: this.restaurant})
  }

    //TODO: Info ob restaurantIsFavourite muss bei toggle an Server geschickt werden.
    public toggleIsFavourite(){
    /*  this.restaurantIsFavourite= !this.restaurantIsFavourite;
      console.log(this.restaurantIsFavourite);
      */
    }

    toggleDetails(data) {
      if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'ios-add-circle-outline';
      } else {
        data.showDetails = true;
        data.icon = 'ios-remove-circle-outline';
      }
    }

    public toggleGroup(group) {
      if (this.isGroupShown(group)) {
        this.shownGroup = null;
      } else {
        this.shownGroup = group;
      }
    }

    isGroupShown(group) {
      return this.shownGroup === group;
    }

   public goToCheckout() {
     this.navCtrl.push(OrderDetailsPage, {
       restaurant: this.restaurant
     });
    }
}

