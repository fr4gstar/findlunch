import {Component} from "@angular/core";
import {NavController, Platform} from "ionic-angular";
import {Coordinates, Geolocation} from "@ionic-native/geolocation";
import {CameraPosition, GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng} from "@ionic-native/google-maps";
import {Http} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {OffersPage} from "../offers/offers";
import {Restaurant} from "../../model/Restaurant";

export const ANDROID_API_KEY = "AIzaSyAvO9bl1Yi2hn7mkTSniv5lXaPRii1JxjI";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private _map: GoogleMap;

  constructor(public navCtrl: NavController,
              private geolocation: Geolocation,
              private platform: Platform,
              private googleMaps: GoogleMaps,
              private http: Http
  ) {
    this.platform.ready().then(() => {
      // access native APIs
    })
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
  }


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

        this.geolocation.getCurrentPosition().then((res) => {
          let pos = new LatLng(res.coords.latitude, res.coords.longitude);

          this.fetchRestaurants(res.coords);

          let camPos: CameraPosition = {
            target: pos,
            zoom: 16
          };

          this._map.moveCamera(camPos);
        })
      }
    );
  }

  private fetchRestaurants(coords: Coordinates) {
    // do not filter by radius, because there are just a few restaurants.
    // in the future it could filter by using the visible map-area.
    this.http.get(`${SERVER_URL}/api/restaurants?latitude=${coords.latitude}&longitude=${coords.longitude}&radius=9999999`).subscribe(
      res => {
        console.log(res.json());
        // show markers for all restaurants
        res.json().forEach((restaurant: Restaurant) => {
          this._map.addMarker({
            position: new LatLng(restaurant.locationLatitude, restaurant.locationLongitude),
            icon: 'http://maps.google.com/mapfiles/kml/shapes/dining.png',
            title: restaurant.name,
            snippet: `Adresse: ${restaurant.street} ${restaurant.streetNumber}\nTelefon: ${restaurant.phone}\nKüche: ${restaurant.kitchenTypes.join(', ')}`,
            infoClick: () => {
              this.navCtrl.push(OffersPage,{restaurant_id: restaurant.id});
            }
          })
        });
      }
    )
  }
}
