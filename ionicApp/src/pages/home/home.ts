import {Component, ElementRef, NgZone, OnDestroy, ViewChild} from "@angular/core";
import {Events, ModalController, NavController, Platform, PopoverController} from "ionic-angular";
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
export const EVENT_TOPIC_MAP_CLICKABLE = "map:clickable";

// this is needed for google maps plugin v2
declare var plugin: any;
declare var cordova: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnDestroy {

    @ViewChild('map') theMap: ElementRef;
    private _map: any;
    private _mapMarkers = [];
    private _allRestaurants: Array<Restaurant>;

    constructor(private navCtrl: NavController,
                private modalCtrl: ModalController,
                private http: Http,
                private popCtrl: PopoverController,
                private popService: FilterPopoverService,
                private events: Events,
                private platform: Platform,
                private zone: NgZone
    ) {
        this.events.subscribe(EVENT_TOPIC_MAP_CLICKABLE, eventData => {
            if (eventData === false) {
                this._map.setClickable(false);
            }
            else if (eventData === true) {
                this._map.setClickable(true);
            }
        });
        this.platform.ready().then(() => {
            this.loadMap();
        });
    }

    public ionViewDidEnter() {
        // map should always be clickable when entering this page
        if (this._map) {
            this._map.setClickable(true);
            cordova.fireDocumentEvent('plugin_touch', {});      // gives native map focus
        }
    }

    public ngOnDestroy() {
        console.debug("HomePage was destroyed!");
    }

    public openFilterDialog(ev: Event) {
        // TODO: Still needed?
        this._map.setClickable(false);      // needed to be able to click on the overlay

        let pop = this.popCtrl.create(FilterPopoverComponent);

        pop.present({ev});

        pop.onWillDismiss(() => {
            // filter kitchen types
            // this assumes, that kitchen-types are ALWAYS set on a restaurant
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

                this._map.getMyLocation(null,
                    (pos) => {
                        // get restaurants around this location
                        this.fetchRestaurants(pos.latLng);

                        // move map to current location
                        let camPos = {
                            target: pos.latLng,
                            zoom: 15
                        };
                        this._map.moveCamera(camPos);
                    },
                    err => {
                        console.error("Error getting location: ", err);
                        this.showAddressInput();
                    })
            }
        );
    }

    /**
     * Fetches the restaurants from the server using the provided coordinates7
     * @param latLng location as LatLng-object
     */
    private fetchRestaurants(latLng: LatLng) {
        // do not filter by radius, because there are just a few restaurants.
        // in the future it could filter by using the visible map-area.
        this.http.get(`${SERVER_URL}/api/restaurants?latitude=${latLng.lat}&longitude=${latLng.lng}&radius=9999999`).subscribe(
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

                let infoDiv = document.createElement("div");
                infoDiv.innerHTML = `<div>
<span style="font-size: large; font-weight: bold; margin-bottom: 8px">${restaurant.name}</span>
<div>Adresse: ${restaurant.street} ${restaurant.streetNumber}<br/>
Telefon: ${restaurant.phone}<br/>
Küche: ${restaurant.kitchenTypes.map(type => type.name).join(', ')}<br/>
Entfernung: ${restaurant.distance}m<br/>
<span style="color: ${restaurant.currentlyOpen === true ? "green" : "red"}">${restaurant.currentlyOpen === true ? "Jetzt geöffnet" : "Aktuell geschlossen"}</span><div/>
</div>`;
                infoDiv.addEventListener("click", () => {
                    this._map.setClickable(false);
                    this.zone.run(() => {
                        this.navCtrl.push(OffersPage, {restaurant: restaurant}, {animate: false});
                    });
                });

                // marker size and styling must be done manually
                infoDiv.style.maxWidth = "85%";
                infoDiv.style.display = "inline-block";
                infoDiv.style.padding = "0";

                // append this to the DOM for a short time to be able to calculate offsetHeight and -Width
                this.theMap.nativeElement.appendChild(infoDiv);
                infoDiv.style.height = infoDiv.offsetHeight + 6 + "px";
                infoDiv.style.width = infoDiv.offsetWidth + 12 + "px";
                this.theMap.nativeElement.removeChild(infoDiv);

                infoDiv.style.maxWidth = "none";
                infoDiv.style.margin = "6px 6px 0 6px";

                htmlInfoWindow.setContent(infoDiv);

                marker.on(plugin.google.maps.event.MARKER_CLICK, () => {
                    htmlInfoWindow.open(marker);
                });

                console.debug("adding marker ", marker);
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
        modal.onWillDismiss((coords: Coordinates) => {
            // if the user cancels, coords will be undefined
            if (coords) {
                const latlng = new LatLng(coords.latitude, coords.longitude);

                this._map.addMarker({
                    position: latlng,
                    title: "Ihr Standort"
                });
                this._map.moveCamera({
                    target: latlng,
                    zoom: 15
                });

                this.fetchRestaurants(latlng);
            }
            // map must be set clickable in any case
            this._map.setClickable(true);
        });
        modal.present();
    }
}
