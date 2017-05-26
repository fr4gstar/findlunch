import {Component} from "@angular/core";
import {FilterPopoverService} from "./FilterPopoverService";

@Component({
  templateUrl: "FilterPopoverComponent.html"
})
export class FilterPopoverComponent {

  constructor(public service: FilterPopoverService) {
  }

}
