import {Component, NgZone, OnInit} from "@angular/core";
import {ViewController} from "ionic-angular";
import {NativeGeocoder, NativeGeocoderForwardResult} from "@ionic-native/native-geocoder";
import {TranslateService} from "@ngx-translate/core";
import AutocompleteService = google.maps.places.AutocompleteService;
import AutocompletePrediction = google.maps.places.AutocompletePrediction;
import PlacesServiceStatus = google.maps.places.PlacesServiceStatus;


/**
 * This uses the google-places-service to translate a address, that the user can type in, into
 * a location-suggestion. If the user clicks on that suggestions, this component uses the Geocoder to
 * retrieve it's coordinates.
 *
 * @author David Sautter
 */
@Component({
    templateUrl: 'AddressInputComponent.html'
})
export class AddressInputComponent implements OnInit {

    public autocompleteItems: Object[];
    public acQuery: string;

    public service: AutocompleteService = new google.maps.places.AutocompleteService();

    private locationNotFoundErrorMsg: string;

    constructor(public viewCtrl: ViewController,
                private geocoder: NativeGeocoder,
                private zone: NgZone,
                public translate: TranslateService) {

        this.autocompleteItems = [];
        this.acQuery = '';
    }

    /**
     * Get the string-translations on init
     */
    public ngOnInit(): void {
        this.translate.get("Error.locationNotFound")
            .subscribe(
                (transStr: string) => {
                    this.locationNotFoundErrorMsg = transStr;
                },
                (err: Error) => {
                    // this should not be happening, because if translate does not
                    // find strings, it uses the key. However something could be wrong...
                    console.error("Error: translate.get did fail for key Error.locationNotFound.", err);
                }
            );
    }


    /**
     * This method get's executed, when the user clicks on a suggested location-item.
     * It will use the geocoder to retrieve the Coordinates of that location.
     *
     * @param {google.maps.places.AutocompletePrediction} item suggested location
     */
    public chooseItem(item: AutocompletePrediction): void {
        console.debug("geocoding item", item);

        // geocode
        this.geocoder.forwardGeocode(item.description)
            .then(
                (coords: NativeGeocoderForwardResult) => {
                    this.viewCtrl.dismiss(coords);
                },
                (err: Error) => {
                    console.error("Could not retrieve Coordinates from item: ", item, err);
                    alert(this.locationNotFoundErrorMsg);
                }
            );
    }


    /**
     * This method will get executed every time the user changes it's input into the searchbar.
     * It will query the Places API for matching location-predictions based on the provided input.
     */
    public updateSearch(): void {
        // delete suggestion if nothing is entered
        if (!this.acQuery) {
            this.autocompleteItems = [];
            return;
        }

        this.service.getPlacePredictions(
            {
                input: this.acQuery,
                componentRestrictions: {
                    country: 'DE'    // change this if you plan to use the app outside Germany
                }
            },
            (predictions: AutocompletePrediction[], status: PlacesServiceStatus) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    alert(status);
                    this.acQuery = "";
                    return;
                }
                // need to run this in a zone to inform Angular's change-detection about the new data.
                this.zone.run(() => this.autocompleteItems = predictions);
            });
    }
}
