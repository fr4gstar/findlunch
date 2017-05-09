import {Component, OnInit} from '@angular/core';
import {Http} from "@angular/http";

@Component({
    selector: 'order-details',
    templateUrl: 'order-details.html'
})
export class OrderDetailsPage implements OnInit {
    constructor(private http: Http) {
    }

    ngOnInit() {
    }

    sendOrder() {
    }
}
