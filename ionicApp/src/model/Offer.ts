export interface Offer {
    courseType: { id: number, name: string }
    defaultPhoto: any
    description: string
    id: number
    neededPoints: number
    preparationTime: number
    price: number
    sold_out: boolean
    title: string
    amount: number
    allergenic: Array<any>
    additives: Array<any>
}
