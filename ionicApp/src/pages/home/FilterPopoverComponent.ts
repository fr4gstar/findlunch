import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";

@Component({
  templateUrl: "FilterPopoverComponent.html"
})
export class FilterPopoverComponent {

  public kitchenTypes: Array<{id: number, name: string}>;

  constructor(private http: Http) {
    http.get(SERVER_URL + "/api/kitchen_types").subscribe(res => this.kitchenTypes = res.json());
  }

}
