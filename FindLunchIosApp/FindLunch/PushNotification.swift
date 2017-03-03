//
//  PushNotification.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 02.02.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import Foundation
class PushNotification: Equatable {
    let id: Int
    let gcmToken: String?
    let title: String
    let latitude: Double?
    let longitude: Double?
    let radius: Double?
    let days: [DayOfWeek]
    let kitchenTypes: [KitchenType]
    
    init(id: Int, title: String, gcmToken: String?, latitude: Double?, longitude: Double?, radius: Double?, days: [DayOfWeek], kitchenTypes: [KitchenType]){
        self.id = id
        self.title = title
        self.gcmToken = gcmToken
        self.latitude = latitude
        self.longitude = longitude
        self.radius = radius
        self.days = days
        self.kitchenTypes = kitchenTypes
    }
    
    convenience init (dict: Dictionary<String, AnyObject>){
        let id = dict["id"] as! Int
        let title = dict["title"] as! String
        
        var daysOfWeek = [DayOfWeek]()
        let dictDays: [Dictionary<String, Any>] = dict["dayOfWeeks"] as! [Dictionary<String, Any>]
        for i in dictDays{
            let idString: String = String(describing: i["id"]!)
            let dayOfWeek = DayOfWeek(rawValue: Int(idString)!)
            daysOfWeek.append(dayOfWeek!)
        }
        
        var kitchenTypes = [KitchenType]()
        let dictKitchens: [Dictionary<String, Any>] = dict["kitchenTypes"] as! [Dictionary<String, Any>]
        for i in dictKitchens{
            let idString: String = String(describing: i["id"]!)
            let kitchenType = KitchenType(rawValue: Int(idString)!)
            kitchenTypes.append(kitchenType!)
        }
        
        self.init(id: id, title: title, gcmToken: nil, latitude: nil, longitude: nil, radius: nil, days: daysOfWeek, kitchenTypes: kitchenTypes)
    }
    
    func json() -> Data{
        
        var daysDict: [[String : Any]] = [[String : Any]]()
        for day in days {
            daysDict.append(["id": day.rawValue, "name": day.getGermanDesc(), "dayNumber": day.getDayNumber()])
            
        }
        
        var kitchensDict: [[String : Any]] = [[String : Any]]()
        for kitchen in kitchenTypes{
            kitchensDict.append(["id": kitchen.rawValue, "name": kitchen.getGermanDesc()])
        }
        
        let json: [String: Any] = ["title": title, "gcmToken": gcmToken!, "latitude": latitude!, "longitude": longitude!, "radius": radius!, "dayOfWeeks": daysDict, "kitchenTypes": kitchensDict]
        return try! JSONSerialization.data(withJSONObject: json, options: JSONSerialization.WritingOptions.prettyPrinted)
    }
    
}
func ==(lhs: PushNotification, rhs: PushNotification) -> Bool {
    return lhs.id == rhs.id
}
