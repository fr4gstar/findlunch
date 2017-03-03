//
//  Controller.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 29.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit

class Controller: UIViewController {
    
    var isKeyboardShown: Bool = false
    var isKeyboardCorrectionEnabled: Bool = true
    
    override func viewDidLoad() {
        super.viewDidLoad()
     
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(Controller.dismissKeyboard))
        view.addGestureRecognizer(tap)
        
        NotificationCenter.default.addObserver(self, selector: #selector(Controller.keyboardWillShow), name: NSNotification.Name.UIKeyboardWillShow, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(Controller.keyboardWillHide), name: NSNotification.Name.UIKeyboardWillHide, object: nil)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name.UIKeyboardWillShow, object: nil)
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name.UIKeyboardWillHide, object: nil)
    }
    
    func dismissKeyboard() {
        view.endEditing(true)
    }
    
    func keyboardWillShow(notification: NSNotification) {
        if let keyboardSize = (notification.userInfo?[UIKeyboardFrameBeginUserInfoKey] as? NSValue)?.cgRectValue {
            let originY = self.view.frame.origin.y
            if originY != 0{
                print("y: " + String(describing: self.view.frame.origin.y))
                if(!isKeyboardShown){
                    self.view.frame.origin.y -= keyboardSize.height - 50
                }
            }
        }
        isKeyboardShown = true
    }
    
    func keyboardWillHide(notification: NSNotification) {
        
        if let keyboardSize = (notification.userInfo?[UIKeyboardFrameBeginUserInfoKey] as? NSValue)?.cgRectValue {
            if (self.view.frame.origin.y != 0 && isKeyboardShown){
                self.view.frame.origin.y += keyboardSize.height - 50
            }
        }
        isKeyboardShown = false
    }
}
