import {Component, ElementRef, ViewChild} from "@angular/core";
import {Events, ModalController, NavController, Platform, PopoverController} from "ionic-angular";
import {Coordinates, Geolocation} from "@ionic-native/geolocation";
import {Http} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {OffersPage} from "../offers/offers";
import {Restaurant} from "../../model/Restaurant";
import {FilterPopoverComponent} from "./FilterPopoverComponent";
import {FilterPopoverService} from "./FilterPopoverService";
import {AddressInputComponent} from "./AddressInputComponent";
import LatLng = google.maps.LatLng;
import Marker = google.maps.Marker;

export const ANDROID_API_KEY = "AIzaSyAvO9bl1Yi2hn7mkTSniv5lXaPRii1JxjI";
export const CONFIG_GEOLOCATION_TIMEOUT = 2000;

// this is needed for google maps plugin v2
declare var plugin: any;
declare var cordova: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild('map') theMap: ElementRef;
    private _map: any;
    private _mapMarkers = [];
    private _allRestaurants: Array<Restaurant>;

    constructor(private navCtrl: NavController,
                private geolocation: Geolocation,
                private modalCtrl: ModalController,
                private http: Http,
                private popCtrl: PopoverController,
                private popService: FilterPopoverService,
                private events: Events,
                private platform: Platform) {
        this.events.subscribe("menu", eventData => {
            if (eventData === "open") {
                this._map.setClickable(false);
            }
            else if (eventData === "close") {
                this._map.setClickable(true);
            }
        });
        this.platform.ready().then(() => {
            this.loadMap();
        });
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
        // create map
        let element = this.theMap.nativeElement;
        this._map = plugin.google.maps.Map.getMap(element, {});

        // listen to MAP_READY event
        // You must wait for this event to fire before adding something to the map or modifying it in anyway
        this._map.one(plugin.google.maps.event.MAP_READY, () => {
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

                    let camPos = {
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
        this.http.get(`${SERVER_URL}/api/restaurants?latitude=${coords.latitude}&longitude=${coords.longitude}&radius=9999999`).subscribe(
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
                icon: 'http://maps.google.com/mapfiles/kml/shapes/dining.png'
            }, (marker) => {
                // add html info window
                let htmlInfoWindow = new plugin.google.maps.HtmlInfoWindow();
                htmlInfoWindow.setContent(`<div style="white-space: normal">
<h4>${restaurant.name}</h4>
<div id="myCurrentInfoWindow">Adresse: ${restaurant.street} ${restaurant.streetNumber}<br/>
Telefon: ${restaurant.phone}<br/>
Küche: ${restaurant.kitchenTypes.map(type => type.name).join(', ')}<br/>
Entfernung: ${restaurant.distance}m<br/>
Jetzt geöffnet<div/>
</div>`);

                marker.on(plugin.google.maps.event.MARKER_CLICK, () => {
                    htmlInfoWindow.open(marker);
                    setTimeout(() => {
                        document.getElementById("myCurrentInfoWindow").onclick = (event: MouseEvent) => {
                            this.navCtrl.push(OffersPage, {restaurant: restaurant});
                            return event;
                        }
                    }, 100);
                });


                /* // add info window event listener for click
                 marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
                 this.navCtrl.push(OffersPage, {restaurant: restaurant});
                 });*/

                this._mapMarkers.push(marker);
            })
        });
    }

    /**
     * Show the addressinput modal dialog
     */
    private showAddressInput() {
        this._map.setClickable(false);
        const modal = this.modalCtrl.create(AddressInputComponent);
        modal.onWillDismiss(coords => {
            // if the user cancels, coords will be undefined
            if (coords) {
                const latlng = new LatLng(coords.latitude, coords.longitude);
                this._map.addMarker({
                    position: latlng,
                    title: "Ihr Standort"
                });
                this._map.moveCamera({
                    target: latlng,
                    zoom: 16
                });
                this.fetchRestaurants(coords);
            }
            // map must be set clickable in any case
            this._map.setClickable(true);
        });
        modal.present();
    }
}
