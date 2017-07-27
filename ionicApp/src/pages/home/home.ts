import {Component, ElementRef, NgZone, OnInit, ViewChild} from "@angular/core";
import {Loading, Modal, ModalController, NavController, Platform, Popover, PopoverController} from "ionic-angular";
import {Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {OffersPage} from "../offers/offers";
import {Restaurant} from "../../model/Restaurant";
import {FilterPopoverComponent} from "./FilterPopoverComponent";
import {FilterPopoverService} from "./FilterPopoverService";
import {AddressInputComponent} from "./AddressInputComponent";
import {LoadingService} from "../../shared/loading.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../shared/auth.service";
import {KitchenType} from "../../model/KitchenType";
import 'rxjs/add/operator/retry';
import LatLng = google.maps.LatLng;


// this is needed for google maps plugin v2
// noinspection TsLint
declare const plugin: any;
// noinspection TsLint
declare const cordova: any;

// constant used in this class - sets default map zoom level
const MAP_DEFAULT_ZOOM_LEVEL: number = 15;

/**
 * This Page displays the map and all restaurants on it.
 * It features filtering of the restaurants as well as manually setting your location
 *
 * Important Note: In order to get this to work on both iOS and Android devices, a beta-version of the cordova-plugin-googlemaps was used.
 * It could become unstable at some time, so please look at the package-lock.json if your version differs from the tested one.
 * Switch to a stable version of the v2-maps as soon as it is released (
 *
 * @author David Sautter
 */
@Component({
    templateUrl: 'home.html',
    selector: 'fl-home'
})
export class HomePage implements OnInit {

    // represents array of unfiltered restaurants
    public allRestaurants: Restaurant[];

    // reference to the rendered map HTML-element
    @ViewChild('map') private theMap: ElementRef;


    // noinspection TsLint - no types for current plugin-googlemaps available
    private map: any;
    // noinspection TsLint - no types for current plugin-googlemaps available
    private mapMarkers: any[] = [];
    // noinspection TsLint - no types for current plugin-googlemaps available
    private customLocationMarker: any;

    // initialize the strings to translate with the default values
    // noinspection TsLint
    private translatedStrs = {
        phone: "phone",
        address: "address",
        distance: "distance",
        kitchen: "kitchen",
        isClosed: "isClosed",
        isOpen: "isOpen"
    };


    constructor(private navCtrl: NavController,
                private modalCtrl: ModalController,
                private http: Http,
                private popCtrl: PopoverController,
                private popService: FilterPopoverService,
                private platform: Platform,
                private zone: NgZone,
                private loading: LoadingService,
                private auth: AuthService,
                private translate: TranslateService) {

        // load the map as soon as the platform is ready
        this.platform.ready().then(
            () => {
                this.loadMap();
            },
            (err: Error) => {
                console.error("Platform did not become ready!", err);
                alert("A fatal Error occured, the app will be closed!");
                platform.exitApp();
            });
    }

    /**
     * When initialized, do the translation of the needed strings.
     */
    public ngOnInit(): void {
        // translate needed strings for info-window
        Object.keys(this.translatedStrs).forEach((key: string) => {
            this.translate.get(key)
                .subscribe(
                    (transStr: string) => this.translatedStrs[key] = transStr,
                    (err: Error) => {
                        // this should not be happening, because if translate does not
                        // find strings, it uses the key. However something could be wrong...
                        console.error(`Error: tranlate.get did fail for key ${key} with error: `, err);
                    }
                );
        });
    }

    // noinspection JSUnusedGlobalSymbols - this is an ionic view lifecycle method so it is indeed used.
    /**
     * The Map must always be clickable when entering this page.
     */
    public ionViewDidEnter(): void {
        if (this.map) {
            this.map.setClickable(true);
            cordova.fireDocumentEvent('plugin_touch', {});      // gives native map focus
        }
    }

    /**
     * Construct and open the filter popup-dialog.
     * @param {Event} ev
     */
    public openFilterDialog(ev: Event): void {
        const pop: Popover = this.popCtrl.create(FilterPopoverComponent);
        pop.present({ev});

        pop.onDidDismiss(() => {
            this.setRestaurantMarkers(this.filterRestaurants(this.allRestaurants));
        });
    }

    /**
     * Applies the filters set in FilterPopoverService to the restaurants
     * @returns {Restaurant[]} the filtered restaurants to show
     */
    private filterRestaurants(allRestaurants: Restaurant[]): Restaurant[] {
        let newRestaurants: Restaurant[] = allRestaurants;

        // filter kitchen types
        // this assumes, that kitchen-types are ALWAYS set on a restaurant
        if (this.popService.selectedKitchenTypes) {     // [] is also truthy, but if it is not loaded yet, this will skip
            newRestaurants = newRestaurants.filter((res: Restaurant) => {
                return res.kitchenTypes.some((resKitchenType: KitchenType) => {
                    return this.popService.selectedKitchenTypes.some((selKitchenType: KitchenType) => {
                        // at least one kitchentype must be matching the selected ones
                        return resKitchenType.id === selKitchenType.id;
                    });
                });
            });
        }

        // show only currently opened
        if (this.popService.showOnlyOpened) {
            newRestaurants = newRestaurants.filter((res: Restaurant) => res.currentlyOpen);
        }

        // show only favorites
        if (this.popService.showOnlyFavorites) {
            newRestaurants = newRestaurants.filter((res: Restaurant) => res.isFavorite);
        }

        return newRestaurants;
    }


    /**
     * Initializes the Map and positions the current device on it.
     */
    private loadMap(): void {
        // create map
        const element: HTMLElement = this.theMap.nativeElement;
        this.map = plugin.google.maps.Map.getMap(element, {});

        // listen to MAP_READY event
        // You must wait for this event to fire before adding something to the map or modifying it in anyway
        this.map.one(plugin.google.maps.event.MAP_READY, () => {

                this.map.setMyLocationEnabled(true);
                this.map.setAllGesturesEnabled(true);
                this.map.setCompassEnabled(true);

                this.map.getMyLocation(
                    null,
                    (pos: { latLng: LatLng }) => {
                        // get restaurants around this location
                        // currently, all restaurants are fetched, but I leave this code here (though it's slower this way),
                        // because once you start really filtering restaurants based on the location, you'll need it here.
                        this.fetchRestaurants(pos.latLng);

                        // move map to current location
                        // noinspection TsLint - no types for current plugin-googlemaps available
                        const camPos = {
                            target: pos.latLng,
                            zoom: MAP_DEFAULT_ZOOM_LEVEL
                        };
                        this.map.moveCamera(camPos);
                    },
                    (err: Error) => {
                        console.error("Error getting location: ", err);
                        this.showAddressInput();
                    });
            }
        );
    }


    /**
     * Fetches the restaurants from the server using the provided coordinates. Initiates a loading
     * animation while fetching. It also triggers filtering the restaurants after they were fetched.
     * @param latLng location of type LatLng
     */
    private fetchRestaurants(latLng: LatLng): void {

        // setup loading spinner
        const loader: Loading = this.loading.prepareLoader();
        loader.present().then(() => {

            // build authentication header...
            const options: RequestOptions = this.auth.prepareHttpOptions(RequestMethod.Get);

            // do not filter by radius, because there are just a few restaurants.
            // in the future it could filter by using the visible map-area.
            this.http.get(`${SERVER_URL}/api/restaurants?latitude=${latLng.lat}&longitude=${latLng.lng}&radius=9999999`, options)
                .retry(2)
                .subscribe(
                    (res: Response) => {
                        // needed for enabling filter-button in header dynamically
                        this.zone.run(() => {
                            this.allRestaurants = res.json();
                            this.setRestaurantMarkers(this.filterRestaurants(this.allRestaurants));

                            // remove loading spinner
                            loader.dismiss();
                        });
                    },
                    (err: Error) => {
                        loader.dismiss();
                        console.error("Error fetching restaurants", err);
                        //TODO: Prompt user. Actions: Retry, Close App
                    }
                );
        });
    }


    /**
     *  Shows markers for the provided restaurants
     */
    private setRestaurantMarkers(restaurants: Restaurant[]): void {
        // remove old markers
        // noinspection TsLint - no types for current plugin-googlemaps available
        this.mapMarkers.forEach((marker: any) => {
            marker.remove();
        });

        // draw new markers
        restaurants.forEach((restaurant: Restaurant) => {
            // noinspection TsLint - no types for current plugin-googlemaps available
            this.map.addMarker({
                position: new LatLng(restaurant.locationLatitude, restaurant.locationLongitude),
                icon: 'http://maps.google.com/mapfiles/kml/shapes/dining.png'
            }, (marker: any) => {
                // add html info window
                // noinspection TsLint - no types for current plugin-googlemaps available
                const htmlInfoWindow: any = new plugin.google.maps.HtmlInfoWindow();

                const infoDiv: HTMLElement = document.createElement("div");

                // costruct the html-info-window content and fill with data
                // noinspection TsLint
                infoDiv.innerHTML = `<div style="display: inline-block">
<div style="font-size: large; font-weight: bold; margin-bottom: 5px">${restaurant.name}</div>
<div style="display: inline-block">${this.translatedStrs.address}: ${restaurant.street} ${restaurant.streetNumber}<br/>
${this.translatedStrs.phone}: ${restaurant.phone}<br/>
${this.translatedStrs.kitchen}: ${restaurant.kitchenTypes.map(kitType => kitType.name).join(', ')}<br/>
${this.translatedStrs.distance}: ${restaurant.distance}m<br/>
<span style="color: ${restaurant.currentlyOpen === true ? "green" : "red"}">${restaurant.currentlyOpen === true ? this.translatedStrs.isOpen : this.translatedStrs.isClosed}</span><div/>
</div>`;
                infoDiv.addEventListener("click", () => {
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
                infoDiv.style.height = `${infoDiv.offsetHeight + 1}px`;
                infoDiv.style.width = `${infoDiv.offsetWidth + 4}px`;
                this.theMap.nativeElement.removeChild(infoDiv);

                infoDiv.style.maxWidth = "none";
                infoDiv.style.margin = "6px";

                htmlInfoWindow.setContent(infoDiv);

                marker.on(plugin.google.maps.event.MARKER_CLICK, () => {
                    htmlInfoWindow.open(marker);
                });

                // add marker to the map
                this.mapMarkers.push(marker);
            });
        });
    }

    /**
     * Show the dialog for putting in an address, that will set the custom location
     */
    private showAddressInput(): void {
        const modal: Modal = this.modalCtrl.create(AddressInputComponent);

        // process the new coordinates
        modal.onWillDismiss((coords: Coordinates) => {
            // if the user cancels, coords will be undefined, so do nothing then
            if (coords) {
                const latlng: LatLng = new LatLng(coords.latitude, coords.longitude);

                // remove old marker if already set
                if (this.customLocationMarker) {
                    this.customLocationMarker.remove();
                }

                // set new marker
                // noinspection TsLint - no types for current plugin-googlemaps available
                this.map.addMarker({
                    position: latlng
                }, marker => {
                    this.customLocationMarker = marker;
                });

                this.map.moveCamera({
                    target: latlng,
                    zoom: MAP_DEFAULT_ZOOM_LEVEL
                });

                // As soon as you start fetching only local restaurants, fetch Restaurants here!
                // Since we are currently fetching all restaurants, we can skip that.
                // this.fetchRestaurants(latlng);
            }
        });
        modal.present();
    }
}
