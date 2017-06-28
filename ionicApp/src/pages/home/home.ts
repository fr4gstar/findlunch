import {Component} from "@angular/core";
import {Events, ModalController, NavController, PopoverController} from "ionic-angular";
import {Coordinates, Geolocation} from "@ionic-native/geolocation";
import {CameraPosition, GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, Marker} from "@ionic-native/google-maps";
import {Headers, Http, RequestMethod, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {OffersPage} from "../offers/offers";
import {Restaurant} from "../../model/Restaurant";
import {FilterPopoverComponent} from "./FilterPopoverComponent";
import {FilterPopoverService} from "./FilterPopoverService";
import {AddressInputComponent} from "./AddressInputComponent";
import {AuthService} from "../../providers/auth-service";

export const ANDROID_API_KEY = "AIzaSyAvO9bl1Yi2hn7mkTSniv5lXaPRii1JxjI";
export const CONFIG_GEOLOCATION_TIMEOUT = 2000;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private _map: GoogleMap;
  private _mapMarkers: Array<Marker> = [];
  private _allRestaurants: Array<Restaurant>;

  constructor(private navCtrl: NavController,
              private geolocation: Geolocation,
              private modalCtrl: ModalController,
              private googleMaps: GoogleMaps,
              private http: Http,
              private popCtrl: PopoverController,
              private popService: FilterPopoverService,
              private events: Events,
              private auth: AuthService
  ) {
    this.events.subscribe("menu", eventData => {
      if (eventData === "open"){
        this._map.setClickable(false);
      }
      else if (eventData === "close") {
        this._map.setClickable(true);
      }
    })
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
  }

  public openFilterDialog(ev: Event) {
    this._map.setClickable(false);      // needed to be able to click on the overlay

    let pop = this.popCtrl.create(FilterPopoverComponent);

    pop.present({ev});

    pop.onWillDismiss(() => {
      // filter kitchen types
      let newRestaurants = this._allRestaurants.filter(res => {
        return res.kitchenTypes.some(resKitchenType => {
          return this.popService.selectedKitchenTypes.some(selKitchenType => {
            return resKitchenType.id === selKitchenType.id
          })
        })
      });

      // show only favorites
      if (this.popService.showOnlyFavorites) {
        newRestaurants = newRestaurants.filter(res => res.isFavorite);
      }

      this.setRestaurantMarkers(newRestaurants);
      this._map.setClickable(true);
    })
  }


  /**
   * Initializes the Map and positions the current device on it.
   */
  private loadMap() {
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    this._map = this.googleMaps.create(element);

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    this._map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker

        this._map.setMyLocationEnabled(true);
        this._map.setAllGesturesEnabled(true);
        this._map.setCompassEnabled(true);

        this.geolocation.getCurrentPosition({
          timeout: CONFIG_GEOLOCATION_TIMEOUT
        }).then((res) => {
          let pos = new LatLng(res.coords.latitude, res.coords.longitude);

          this.fetchRestaurants(res.coords);

          let camPos: CameraPosition = {
            target: pos,
            zoom: 16
          };

          this._map.moveCamera(camPos);
        })
            .catch(err => {
              this._map.setMyLocationEnabled(false);
              this.showAddressInput();
            })
      }
    );
  }

  /**
   * Fetches the restaurants from the server using the provided coordinates
   * @param coords
   */
  private fetchRestaurants(coords: Coordinates) {
    // do not filter by radius, because there are just a few restaurants.
    // in the future it could filter by using the visible map-area.

      let options;
      if(this.auth.getLoggedIn()){

          let user = window.localStorage.getItem("username");
          let token = window.localStorage.getItem(user);
          let headers = new Headers({
              'Content-Type': 'application/json',
              "Authorization": "Basic " +token
          });

          options = new RequestOptions({
              headers: headers,
              method: RequestMethod.Get
          });
      }

    this.http.get(`${SERVER_URL}/api/restaurants?latitude=${coords.latitude}&longitude=${coords.longitude}&radius=9999999`,options).subscribe(
      res => {
        this._allRestaurants = res.json();
        this.setRestaurantMarkers(this._allRestaurants);
      }
    )
  }


  /**
   *  Shows markers for the provided restaurants
   */
  private setRestaurantMarkers(restaurants) {
    // remove old markers
    this._mapMarkers.forEach(marker => {
      marker.remove();
    });

    // draw new markers
    restaurants.forEach((restaurant: Restaurant) => {
      this._map.addMarker({
        position: new LatLng(restaurant.locationLatitude, restaurant.locationLongitude),
        icon: 'http://maps.google.com/mapfiles/kml/shapes/dining.png',
        title: restaurant.name,
        snippet: `Adresse: ${restaurant.street} ${restaurant.streetNumber}
Telefon: ${restaurant.phone}
Küche: ${restaurant.kitchenTypes.map(type => type.name).join(', ')}
Entfernung: ${restaurant.distance}m
Jetzt geöffnet`,

        infoClick: () => {
          this.navCtrl.push(OffersPage,{restaurant: restaurant});
        }
      }).then(marker => {
        this._mapMarkers.push(marker);
      })
    });
  }


  private showAddressInput() {
    this._map.setClickable(false);
    const modal = this.modalCtrl.create(AddressInputComponent);
    modal.onWillDismiss(coords => {
      const latlng = new LatLng(coords.latitude, coords.longitude);
      this._map.setClickable(true);
      this._map.addMarker({
        position: latlng,
        title: "Ihr Standort"
      });
      this._map.moveCamera({
        target: latlng,
        zoom: 16
      });

      this.fetchRestaurants(coords)
    });
    modal.present();
  }
}
