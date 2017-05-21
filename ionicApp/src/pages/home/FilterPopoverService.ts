import {Injectable} from "@angular/core";
import {KitchenType} from "../../model/KitchenType";
import {Http} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import "rxjs/Rx";

@Injectable()
export class FilterPopoverService {
  private _kitchenTypes: Array<KitchenType>;
  public selectedKitchenTypes: Array<KitchenType>;

  constructor(private http: Http) {
    this.http.get(SERVER_URL + "/api/kitchen_types").subscribe(res => this._kitchenTypes = res.json())
  }

  get kitchenTypes() {
    return this._kitchenTypes;
  }
  /*get kitchenTypes() {
    if (this._kitchenTypes) {
      return Observable.create(() => {
        return this._kitchenTypes;
      })
    }
    return this.http.get(SERVER_URL + "/api/kitchen_types").map(res => this._kitchenTypes = res.json());
  }*/
}
