import {Component, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {OffersService} from "./OffersService";
import {OffersProductViewPage} from "../offers-product-view/offers-product-view";
import {AuthService} from "../../providers/auth-service";


export const FL_NAVPARAM_OFFER_ID = "offer_id";

@Component({
    selector: 'offers',
    templateUrl: 'offers.html'
})

export class OffersPage implements OnInit {
    private _restaurant_id: number;
    public offers: any;
    public arrayOfKeys;
    public restaurantIsFavourite = false; //TODO Info ob Restaurant zu favoriten gehört holen
    public restaurantName = "RestaurantXY"; //TODO Namen des angeklickten restaurants
    public allergene = [1,2,3,4,5,6,7,8];
    shownGroup = null;

  constructor(
        navParams: NavParams,
        private offerService: OffersService,
        private navCtrl: NavController,
        private auth: AuthService
    ) {
        this._restaurant_id = parseInt(navParams.get("restaurant_id"));
    }

    ngOnInit() {
        this.offerService.getOffers(this._restaurant_id).subscribe(

            offers => {
              this.offers = offers;
              this.arrayOfKeys = Object.keys(offers);
                      },
            err => console.error(err)
        )
    }

    public onOfferClicked(event, offer) {
        this.navCtrl.push(OffersProductViewPage, {offer, restaurant_id: this._restaurant_id})
    }

    //TODO: Info ob restaurantIsFavourite muss bei toggle an Server geschickt werden.
    public toggleIsFavourite(){
      this.restaurantIsFavourite= !this.restaurantIsFavourite;
      console.log(this.restaurantIsFavourite);
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

}

