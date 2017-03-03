//
//  ArrayExtension.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 04.02.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

extension Array where Element: Equatable {
    
    mutating func remove(object: Element) {
        if let index = index(of: object) {
            remove(at: index)
        }
    }
}
