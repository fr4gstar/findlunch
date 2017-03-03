//
//  Configuration.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 19.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import Foundation
import MapKit
class Configuration{
    
    let dateFormatterView: DateFormatter
    let dateFormatterSql: DateFormatter
    let locale: Locale
    let defaultServerAddress: String
    var loginStringBase64: String?
    var myLocation: CLLocationCoordinate2D?
    var firToken: String?
    
    var serverAddress: String?{
        set{
            UserDefaults.standard.set(newValue, forKey: "serverAddress")
        }
        
        get{
            return UserDefaults.standard.string(forKey: "serverAddress")
        }
    }
    
    init(){
        
        locale = Locale.init(identifier: "de_DE")
        
        dateFormatterView = DateFormatter()
        dateFormatterView.dateFormat = "dd. MMMM yyyy"
        dateFormatterView.locale = locale
        
        dateFormatterSql = DateFormatter()
        dateFormatterSql.dateFormat = "yyyy-MM-dd"
        
        defaultServerAddress = "http://127.0.0.1:8080"
        
    }
    
    func cookieSession() -> String{
        let cookies = HTTPCookieStorage.shared.cookies
        let value = cookies?[0].value(forKey: "value") as! String
    
        return value
    }
    
}

let configuration = Configuration()
