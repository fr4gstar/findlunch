import {Injectable} from "@angular/core";
import {KitchenType} from "../../model/KitchenType";
import {Http} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";
import {AuthService} from "../../providers/auth-service";
import "rxjs/Rx";

@Injectable()
export class FilterPopoverService {
  private _kitchenTypes: Array<KitchenType>;
  public selectedKitchenTypes: Array<KitchenType>;
  public showOnlyFavorites: boolean;
  public showOnlyOpened: boolean;
  public loggedIn = this.auth.getLoggedIn();

  constructor(private http: Http, private auth: AuthService) {
    this.http.get(SERVER_URL + "/api/kitchen_types").subscribe(res => {
      this._kitchenTypes = res.json();
      this.selectedKitchenTypes = this._kitchenTypes;
    });
  }

  get kitchenTypes() {
    return this._kitchenTypes;
  }
}
