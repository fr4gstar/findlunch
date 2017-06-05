import {KitchenType} from "./KitchenType";

export interface Restaurant {
  actualPoints: number,
  city: string,
  country: Object,
  distance: number,
  email: string,
  id: number,
  isFavorite: boolean,
  kitchenTypes: Array<KitchenType>,
  locationLatitude: number,
  locationLongitude: number,
  name: string,
  phone: string,
  restaurantType: Object,
  street: string,
  streetNumber: string,
  timeSchedules: Array<Object>,
  url: string,
  zip: string
}
