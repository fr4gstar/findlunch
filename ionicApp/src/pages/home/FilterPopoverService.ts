import {Injectable, OnInit} from "@angular/core";
import {KitchenType} from "../../model/KitchenType";
import {Http, Response} from "@angular/http";
import {SERVER_URL} from "../../app/app.module";

/**
 * This serves as a communication-service between the filtering popover-component and the map.
 * It holds the state of the currently selected filters.
 * @author David Sautter
 */
@Injectable()
export class FilterPopoverService implements OnInit {

    // filter states
    public selectedKitchenTypes: KitchenType[];
    public showOnlyFavorites: boolean;
    public showOnlyOpened: boolean;

    // all possible kitchen-types (fetched from the server)
    public kitchenTypes: KitchenType[];


    constructor(private http: Http) {
    }

    public ngOnInit(): void {
        this.http.get(`${SERVER_URL}/api/kitchen_types`)
            .retry(2)
            .subscribe(
                (res: Response) => {
                    this.kitchenTypes = res.json();

                    // initially select all kitchen-types
                    this.selectedKitchenTypes = this.kitchenTypes;
                },
                (err: Error) => {
                    console.error("Error fetching kitchenTypes", err);
                    // TODO: What should happen in that case?
                    // reload or close app
                }
            );
    }
}
