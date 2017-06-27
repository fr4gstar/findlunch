import {Offer} from "./Offer";
import {Restaurant} from "./Restaurant";

export interface Reservation {
  id: number,
  donation: number,
  totalPrice: number,
  usedPoints: boolean,
  reservationNumber: number,
  reservation_offers: Array<Offer>,
  restaurant: Restaurant,
  bill: number,
  reservationStatus:
    {
      id: number, status: string, key: number
    },
  collectTime: number,
  timestampReceived: number,
  timestampResponded: number
}
