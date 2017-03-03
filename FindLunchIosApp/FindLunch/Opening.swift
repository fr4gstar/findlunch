//
//  OpeningHours.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 18.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import Foundation

class Opening {
    
    var monday: OpeningDay
    var tuesday: OpeningDay
    var wednesday: OpeningDay
    var thursday: OpeningDay
    var friday: OpeningDay
    var saturday: OpeningDay
    var sunday: OpeningDay
    
    init(monday: OpeningDay, tuesday: OpeningDay, wednesday: OpeningDay, thursday: OpeningDay, friday: OpeningDay, saturday: OpeningDay, sunday: OpeningDay){
        self.monday = monday
        self.tuesday = tuesday
        self.wednesday = wednesday
        self.thursday = thursday
        self.friday = friday
        self.saturday = saturday
        self.sunday = sunday
    }
    
    
}

class OpeningDay {
    var dayOfWeek: DayOfWeek
    var from: Date
    var until: Date
    
    init(dayOfWeek: DayOfWeek, from: Date, until: Date){
        self.dayOfWeek = dayOfWeek
        self.from = from
        self.until = until
    }
}

