import {Component} from "@angular/core";
import {FilterPopoverService} from "./FilterPopoverService";
import {AuthService} from "../../providers/auth-service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    templateUrl: "FilterPopoverComponent.html"
})
export class FilterPopoverComponent {

    constructor(public service: FilterPopoverService,
                public auth: AuthService, translate: TranslateService
) {
        translate.setDefaultLang('de');
    }
}
