import {Component, NgZone, OnInit} from "@angular/core";
import {ViewController} from "ionic-angular";
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import ComponentRestrictions = google.maps.places.ComponentRestrictions;
import {} from '@types/googlemaps';

@Component({
    selector: 'AddressInputComponent',
    templateUrl: 'AddressInputComponent.html'
})

export class AddressInputComponent implements OnInit {

    autocompleteItems;
    autocomplete;
    service = new google.maps.places.AutocompleteService();

    constructor(public viewCtrl: ViewController, private zone: NgZone, private geocoder: NativeGeocoder) {
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
    }

    ngOnInit() {
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {
        // geocode
        this.geocoder.forwardGeocode(item.description).then(coords => {
            this.viewCtrl.dismiss(coords);
        });
    }

    updateSearch() {
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let me = this;
        this.service.getPlacePredictions({
                input: this.autocomplete.query,
                componentRestrictions: {
                    country: 'DE'
                }
            },
            function (predictions, status) {
                me.autocompleteItems = [];
                me.zone.run(function () {
                    predictions.forEach(function (prediction) {
                        me.autocompleteItems.push(prediction);
                    });
                });
            });
    }
}
