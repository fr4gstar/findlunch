import {Component} from "@angular/core";
import {FilterPopoverService} from "./FilterPopoverService";
import {AuthService} from "../../providers/auth-service";

@Component({
    templateUrl: "FilterPopoverComponent.html"
})
export class FilterPopoverComponent {

    constructor(public service: FilterPopoverService,
                public auth: AuthService
) {}
}
