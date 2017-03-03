//
//  Rest.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 17.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import Foundation
import MapKit

class Rest {
    // TODO: Timeout einbauen
    // TODO: abstrahieren und wiederverwenden Methoden
    
    let TIMEOUT = 5.0 //Timout in seconds
    
    let config = URLSessionConfiguration.default
    
    func getRestaurants(longitude :CLLocationDegrees, latitude :CLLocationDegrees, radiusInMetres :Int) -> [Restaurant]{
    
        let function =  "/api/restaurants" + "?longitude=" + String(longitude) + "&latitude=" + String(latitude) + "&radius=" + String(radiusInMetres)
        
        let urlString = configuration.serverAddress! + function
        
        var isEnded: Bool = false
        let url = URL(string: urlString)!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        let startTime = DispatchTime.now()
        var restaurantsResult: [Restaurant] = [Restaurant]()
        sendRequestForRestaurants(request: request, onCompleted: {restaurants in
            restaurantsResult = restaurants
            isEnded = true
        })
        var isTimedOut = false
        while !isEnded && !isTimedOut {
            isTimedOut = checkForTimeout(startTime: startTime)
        }
        
        return restaurantsResult
     
    }
    
    func sendRequestForRestaurants(request: URLRequest, onCompleted:@escaping (_ restaurants: [Restaurant]) -> ()) {
        let session = URLSession(configuration: config)
        var restaurants = [Restaurant]()
        let task = session.dataTask(with: request){
            (data, response, error) in

            if error != nil {
                print(error!.localizedDescription)
            } else {
                let json = try? JSONSerialization.jsonObject(with: data!, options: []) as! [[String: Any]]
                for dict in json! {
                    restaurants.append(self.dictToRestaurant(dict: dict as Dictionary<String, AnyObject>))
                }
            }
            
            onCompleted(restaurants)
        }
        task.resume()
    }
    
    func sendRequestForFavRestaurants(request: URLRequest, onCompleted:@escaping (_ restaurants: [Restaurant]) -> ()) {
        let session = URLSession(configuration: config)
        var restaurants = [Restaurant]()
        let task = session.dataTask(with: request){
            (data, response, error) in
            
            if error != nil {
                print(error!.localizedDescription)
            } else {
                let json = try? JSONSerialization.jsonObject(with: data!, options: []) as! [[String: Any]]
                for dict in json! {
                    restaurants.append(self.dictToRestaurant(dict: dict as Dictionary<String, AnyObject>))
                }
            }
            
            onCompleted(restaurants)
        }
        task.resume()
    }
    
    func getOffers(restaurant :Restaurant) -> [Offer]{
        
        let function = "/api/offers" + "?restaurant_id=" + String(restaurant.id)
        let urlString = configuration.serverAddress! + function
        
        let url = URL(string: urlString)!
        var isEnded = false
        var offersResult: [Offer] = [Offer]()
        let startTime = DispatchTime.now()
        sendRequestForOffers(url: url, restaurant: restaurant, onCompleted: {offers in
            offersResult = offers
            isEnded = true
        })
        var isTimedOut = false
        while !isEnded && !isTimedOut {
            isTimedOut = checkForTimeout(startTime: startTime)
        }
        
        return offersResult
    }
    
    func sendRequestForOffers(url: URL, restaurant: Restaurant, onCompleted:@escaping (_ offers: [Offer]) -> ()) {
        let session = URLSession(configuration: config)
        var offers = [Offer]()
        let task = session.dataTask(with: url){
            (data, response, error) in
            
            if error != nil {
                print(error!.localizedDescription)
            } else {
                let json = try? JSONSerialization.jsonObject(with: data!, options: []) as! [[String: Any]]
                
                for dict in json! {
                    let offer = Offer.init(dict: dict as Dictionary<String, AnyObject>, restaurant: restaurant)
                    offers.append(offer)
                }
            }
            
            onCompleted(offers)
        }
        task.resume()
    }
    
    func getPushNotifications() -> [PushNotification]{
        let function = "/api/get_push"
        let urlString = configuration.serverAddress! + function
        let url = URL(string: urlString)!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Basic \(configuration.loginStringBase64!)", forHTTPHeaderField: "Authorization")
        
        var isEnded = false
        var pushNotificationsResult: [PushNotification] = [PushNotification]()
        let startTime = DispatchTime.now()
        sendRequestForPushNotifications(request: request, onCompleted: {pushNotifications in
            pushNotificationsResult = pushNotifications
            isEnded = true
        })
        var isTimedOut = false
        while !isEnded && !isTimedOut {
            isTimedOut = checkForTimeout(startTime: startTime)
        }
        return pushNotificationsResult
    }
    
    func sendRequestForPushNotifications(request: URLRequest, onCompleted:@escaping (_ pushNotifications: [PushNotification]) -> ()) {
        let session = URLSession(configuration: config)
        var pushNotifications = [PushNotification]()
        let task = session.dataTask(with: request){
            (data, response, error) in
            if error != nil {
                print(error!.localizedDescription)
            } else {
                let json = try? JSONSerialization.jsonObject(with: data!, options: []) as! [[String: Any]]
                for dict in json! {
                    let pushNotification = PushNotification.init(dict: dict as Dictionary<String, AnyObject>)
                    pushNotifications.append(pushNotification)
                }
            }
            
            onCompleted(pushNotifications)
        }
        task.resume()
    }
    
    func dictToRestaurant(dict: Dictionary<String, AnyObject>) -> Restaurant{
        return Restaurant.init(dict: dict)
    }
    
    
    func login() -> Bool{
        // create the request
        let url = URL(string: configuration.serverAddress! + "/api/login_user")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Basic \(configuration.loginStringBase64!)", forHTTPHeaderField: "Authorization")
        var isEnded = false
        var isResponseOk = false
        let startTime = DispatchTime.now()
        sendRequestForResponse(request: request, onCompleted: { response in
            isResponseOk = response.statusCode == 200
            isEnded = true
        })
        var isTimedOut = false
        while !isEnded && !isTimedOut {
            isTimedOut = checkForTimeout(startTime: startTime)
        }
        return isResponseOk
    }
    
    func sendRequestForResponse(request: URLRequest,  onCompleted:@escaping (_ response: HTTPURLResponse) -> ()){
        let session = URLSession(configuration: config)
        let task = session.dataTask(with: request){
            (data, response, error) in
            if error == nil {
                onCompleted(response as! HTTPURLResponse)
            }
        }
        task.resume()
    }
    
    func registerUser(userName: String, password: String) -> Bool{
        let url = URL(string: configuration.serverAddress! + "/api/register_user")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        let json: [String: Any] = ["username": userName, "password": password]
        let jsonData = try? JSONSerialization.data(withJSONObject: json, options: JSONSerialization.WritingOptions.prettyPrinted)
        request.httpBody = jsonData
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        
        var isResponseOk = false
        var isEnded = false
        let startTime = DispatchTime.now()
        sendRequestForResponse(request: request, onCompleted: { response in
            isResponseOk = response.statusCode == 200
            isEnded = true
        })
        var isTimedOut = false
        while !isEnded && !isTimedOut {
            isTimedOut = checkForTimeout(startTime: startTime)
        }
        return isResponseOk
    }

    func addRestaurantToFavorites(restaurantId: Int) -> Bool{
        let url = URL(string: configuration.serverAddress! + "/api/register_favorite/" + String(restaurantId))!
        var request = URLRequest(url: url)
        
        request.httpMethod = "PUT"
        request.setValue("text/html; charset=utf-8", forHTTPHeaderField: "Content-Type")
        request.setValue("Basic \(configuration.loginStringBase64!)", forHTTPHeaderField: "Authorization")
        
        var responseCode: Int = -1
        var isEnded = false
        let startTime = DispatchTime.now()
        sendRequestForResponse(request: request, onCompleted: { response in
            responseCode = response.statusCode
            isEnded = true
        })
        var isTimedOut = false
        while !isEnded && !isTimedOut {
            isTimedOut = checkForTimeout(startTime: startTime)
        }
        return responseCode == 200
    }
    
    func removeFavorite(restaurantId: Int) -> Bool{
        return removeCall(function: "/api/unregister_favorite/", id: restaurantId)
    }
    
    func removePushNotification(pushNotificationId: Int) -> Bool {
        return removeCall(function: "/api/unregister_push/", id: pushNotificationId)
    }
    
    private func removeCall(function: String, id: Int) -> Bool{
        let url = URL(string: configuration.serverAddress! + function + String(id))!
        var request = URLRequest(url: url)
        
        request.httpMethod = "DELETE"
        request.setValue("text/html; charset=utf-8", forHTTPHeaderField: "Content-Type")
        request.setValue("Basic \(configuration.loginStringBase64!)", forHTTPHeaderField: "Authorization")
        
        var responseCode: Int = -1
        var isEnded = false
        let startTime = DispatchTime.now()
        sendRequestForResponse(request: request, onCompleted: {
            response in
            responseCode = response.statusCode
            isEnded = true
        })
        
        var isTimedOut = false
        while !isEnded && !isTimedOut {
            isTimedOut = checkForTimeout(startTime: startTime)
        }
        return responseCode == 200
    }
    
    
    
    func getFavoriteRestaurants(longitude :CLLocationDegrees, latitude :CLLocationDegrees) -> [Restaurant]{
        
        let function =  "/api/fav_restaurants?longitude=" + String(longitude) + "&latitude=" + String(latitude)
        
        let urlString = configuration.serverAddress! + function
        var isEnded: Bool = false
        let url = URL(string: urlString)!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("text/html; charset=utf-8", forHTTPHeaderField: "Content-Type")
        request.setValue("Basic \(configuration.loginStringBase64!)", forHTTPHeaderField: "Authorization")
        var restaurantsResult: [Restaurant] = [Restaurant]()
        let startTime = DispatchTime.now()
        sendRequestForFavRestaurants(request: request, onCompleted: {restaurants in
            restaurantsResult = restaurants
            isEnded = true
        })
        var isTimedOut = false
        while !isEnded && !isTimedOut {
            isTimedOut = checkForTimeout(startTime: startTime)
        }
        
        return restaurantsResult
        
    }
    
    func registerPushNotification(pushNotification: PushNotification) -> Bool{
        let function = "/api/register_push"
        let urlString = configuration.serverAddress! + function
        let url = URL(string: urlString)
        var request = URLRequest(url: url!)
        request.httpMethod = "POST"
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        request.setValue("Basic \(configuration.loginStringBase64!)", forHTTPHeaderField: "Authorization")
        
        let jsonData = pushNotification.json()
        request.httpBody = jsonData
        var responseCode: Int = -1
        var isEnded = false
        let startTime = DispatchTime.now()
        sendRequestForResponse(request: request, onCompleted: { response in
            responseCode = response.statusCode
            isEnded = true
        })
        
        var isTimedOut = false
        while !isEnded && !isTimedOut {
            isTimedOut = checkForTimeout(startTime: startTime)
        }
        
        return responseCode == 200
        
    }
    
    func checkForTimeout(startTime: DispatchTime) -> Bool{
        let time = DispatchTime.now()
        let nanoTime = time.uptimeNanoseconds - startTime.uptimeNanoseconds
        let timeInterval = Double(nanoTime) / 1_000_000_000
        let isTimedOut = timeInterval > TIMEOUT
        return isTimedOut
    }
    
}
let rest = Rest();
