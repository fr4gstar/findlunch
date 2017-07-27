import {KitchenType} from "./KitchenType";

export interface Restaurant {
    actualPoints: number;
    city: string;
    country: Object;
    currentlyOpen: boolean;
    distance: number;
    email: string;
    id: number;
    isFavorite: boolean;
    kitchenTypes: KitchenType[];
    locationLatitude: number;
    locationLongitude: number;
    name: string;
    phone: string;
    restaurantType: Object;
    street: string;
    streetNumber: string;
    // noinspection TsLint
    timeSchedules: any;
    url: string;
    zip: string;
}
