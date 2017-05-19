import {Component} from "@angular/core";
import {NavController, Platform} from "ionic-angular";
import {Coordinates, Geolocation} from "@ionic-native/geolocation";
import {CameraPosition, GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng} from "@ionic-native/google-maps";

export const ANDROID_API_KEY = "AIzaSyAvO9bl1Yi2hn7mkTSniv5lXaPRii1JxjI";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public pos: Coordinates;


  constructor(public navCtrl: NavController, private geolocation: Geolocation, private platform: Platform, private googleMaps: GoogleMaps) {
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

    let map: GoogleMap = this.googleMaps.create(element);

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker

        map.setMyLocationEnabled(true);
        map.setAllGesturesEnabled(true);
        map.setCompassEnabled(true);

        this.geolocation.getCurrentPosition().then((res) => {
          let pos = new LatLng(res.coords.latitude, res.coords.longitude);

          let camPos: CameraPosition = {
            target: pos,
            zoom: 16
          };

          map.moveCamera(camPos);

          /*!// create current location marker
          map.addMarker({
            position: pos,
          }).then((marker: Marker) => {
            marker.showInfoWindow();
          })*/
        })
      }
    );
  }
}
