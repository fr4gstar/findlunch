//
//  DayOfWeek.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 19.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import Foundation
enum DayOfWeek: Int {
    case monday = 1, tuesday = 2, wednesday = 3, thursday = 4, friday = 5, saturday = 6, sunday = 7
    
    func getGermanDesc() -> String{
        switch self.rawValue {
        case 1:
            return "Montag"
        case 2:
            return "Dienstag"
        case 3:
            return "Mittwoch"
        case 4:
            return "Donnerstag"
        case 5:
            return "Freitag"
        case 6:
            return "Samstag"
        default:
            return "Sonntag"
            
        }
    }
    
    func getDayNumber() -> Int {
        switch self.rawValue {
            case 1:
                return 2
        case 2:
            return 3
        case 3:
            return 4
        case 4:
            return 5
        case 5:
            return 6
        case 6:
            return 7
        case 7:
            return 1
            
        default:
            return -1
        }
    }
}
