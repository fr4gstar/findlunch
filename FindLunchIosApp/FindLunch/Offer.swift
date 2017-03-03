//
//  Offer.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 19.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import Foundation

class Offer{
    var id: Int
    var title: String
    var description: String
    var startTime: Date
    var endTime: Date
    var preparationTime: Int
    var price: Double
    var imageString: String?
    var daysOfWeek: [DayOfWeek]
    var restaurant: Restaurant
    
    init(id: Int, title: String, description: String, preparationTime: Int, startTime: Date, endTime: Date, price: Double, imageString: String?, daysOfWeek: [DayOfWeek], restaurant: Restaurant){
        self.id = id
        self.title = title
        self.description = description
        self.preparationTime = preparationTime
        self.startTime = startTime
        self.endTime = endTime
        self.price = price
        self.imageString = imageString
        self.restaurant = restaurant
        self.daysOfWeek = daysOfWeek
    }
    
    convenience init (dict: Dictionary<String, AnyObject>, restaurant: Restaurant){
        let id = dict["id"] as! Int
        let title = dict["title"] as! String
        let description = dict["description"] as! String
        let startTimeString = dict["startDate"] as! String
        let startTime = configuration.dateFormatterSql.date(from: startTimeString)
        let endTimeString = dict["endDate"] as! String
        let endTime = configuration.dateFormatterSql.date(from: endTimeString)
        let preparationTime = dict["preparationTime"] as! Int
        let price = dict["price"] as! Double
        let restaurant = restaurant
        let imageString = dict["defaultPhoto"]!["thumbnail"] as? String
        
        var daysOfWeek = [DayOfWeek]()
        let dictDays: [Dictionary<String, Any>] = dict["dayOfWeeks"] as! [Dictionary<String, Any>]
        for i in dictDays{
            let idString: String = String(describing: i["id"]!)
            let dayOfWeek = DayOfWeek(rawValue: Int(idString)!)
            daysOfWeek.append(dayOfWeek!)
        }
        
        self.init(id: id, title: title, description: description, preparationTime: preparationTime, startTime: startTime!, endTime: endTime!, price: price, imageString: imageString, daysOfWeek: daysOfWeek, restaurant: restaurant)
    }
    
    func daysOfWeekAsString() -> String{
        
        var resultString: String = ""
        var counter: Int = 1
        for obj in daysOfWeek{
            var stringToAdd: String = ""
            if (counter != 1){
                stringToAdd.append(", ")
            }
            let desc = obj.getGermanDesc()
            let startIndex = desc.startIndex
            let firstTwoLetter = String(desc[startIndex]) + String(desc[desc.index(after: startIndex)])
            
            stringToAdd.append(firstTwoLetter)
            resultString.append(stringToAdd)
            counter += 1
        }
        return resultString
    }
    
}
