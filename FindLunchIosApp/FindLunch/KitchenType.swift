//
//  KitchenType.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 18.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import Foundation

enum KitchenType: Int{
    case italian = 1, indian = 2, greek = 3, asian = 4, bavarian = 5, other = 6
    
    func getGermanDesc() -> String{
        switch self.rawValue {
        case 1:
            return "Italienisch"
        case 2:
            return "Indisch"
        case 3:
            return "Griechisch"
        case 4:
            return "Asiatisch"
        case 5:
            return "Bayerisch"
        case 6:
            return "Sonstiges"
        default:
            return "Not found"
        
        }
    }    
}
