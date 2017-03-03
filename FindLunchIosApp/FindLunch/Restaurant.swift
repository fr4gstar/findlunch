//
//  Restaurant.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 16.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import Foundation
import MapKit

class Restaurant: Equatable {
    
    var id: Int
    var name: String
    var email: String?
    var address: String?
    var zip: String?
    var city: String?
    var country: String?
    var isFavorite: Bool?
    var description: String?
    var distance: Int?
    var phone: String?
    var www: String?
    var kitchenTypes: [KitchenType]?
    var location: CLLocationCoordinate2D?
    var opening: Opening?
    
 
    init(id: Int, name: String, address: String, zip: String, city: String, country: String, description: String, distance: Int, phone: String, email: String, www: String, kitchenTypes: [KitchenType], location: CLLocationCoordinate2D, isFavorite: Bool) {
        self.id = id
        self.name = name
        self.email = email
        self.address = address
        self.zip = zip
        self.city = city
        self.country = country
        self.description = description
        self.distance = distance
        self.phone = phone
        self.www = www
        self.kitchenTypes = kitchenTypes
        self.location = location
        self.isFavorite = isFavorite
    }
    
    convenience init(dict: Dictionary<String, AnyObject>){
        let id = dict["id"] as! Int
        let name = dict["name"] as! String
        let address = String(dict["street"] as! String) + " " + String(dict["streetNumber"] as! String)
        let zip = dict["zip"] as! String
        let city = dict["city"] as! String
        let country = dict["country"]!["name"] as! String
        let description = dict["description"] as? String ?? ""
        let distance = dict["distance"] as! Int
        let phone = dict["phone"] as! String
        let email =  dict["email"] as! String
        let www = dict["url"] as? String ?? ""
        let longitude: CLLocationDegrees = dict["locationLongitude"] as! Double
        let latitude: CLLocationDegrees = dict["locationLatitude"] as! Double
        let location: CLLocationCoordinate2D = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
        
        var kitchenTypes = [KitchenType]()
        
        let dictKitchens: [Dictionary<String, Any>] = dict["kitchenTypes"] as! [Dictionary<String, Any>]
        for i in dictKitchens{
            let idString: String = String(describing: i["id"]!)
            let kitchenType = KitchenType(rawValue: Int(idString)!)
            kitchenTypes.append(kitchenType!)
        }
        
        let isFavorite: Bool = dict["isFavorite"] as! Bool
        
        self.init(id: id, name: name, address: address, zip: zip, city: city, country: country, description: description, distance: distance, phone: phone, email: email, www: www, kitchenTypes: kitchenTypes, location: location, isFavorite: isFavorite)
    }
    
    func kitchenTypesAsString() -> String{
        
        var resultString: String = ""
        var counter: Int = 1
        for obj in kitchenTypes!{
            var stringToAdd: String = ""
            if (counter != 1){
                stringToAdd.append(", ")
            }
            stringToAdd.append(obj.getGermanDesc())
            resultString.append(stringToAdd)
            counter += 1
        }
        return resultString
    }

}

func ==(lhs: Restaurant, rhs: Restaurant) -> Bool {
    return lhs.id == rhs.id
}
