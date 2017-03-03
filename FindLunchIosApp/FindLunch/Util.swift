//
//  Util.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 19.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit

class Util {

    func encodeCredentials(email: String, password: String) -> String{
        return encodeStringBase64(string: String(format: "%@:%@", email, password))
    }
    
    func encodeStringBase64(string: String) -> String {
        let stringData = string.data(using: String.Encoding.utf8)!
        return stringData.base64EncodedString()
    }
    
    func alert(title: String, message: String) -> UIAlertController{
        let alertController = UIAlertController(title: title, message: message, preferredStyle: UIAlertControllerStyle.alert)
        alertController.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
        return alertController
    }
    
    func timeOutAlert() -> UIAlertController {
        return alert(title: "Anfrage fehlgeschlagen", message: "Verbindung prüfen!")
    }
}

let util = Util()
