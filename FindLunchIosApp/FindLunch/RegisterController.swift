//
//  RegisterController.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 27.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit

class RegisterController: UIViewController {
    
    @IBOutlet weak var email: UITextField!
    @IBOutlet weak var password: UITextField!
    @IBOutlet weak var passwordConfirm: UITextField!
    
    
    override func viewDidLoad(){
        super.viewDidLoad()
    }
    
    
    @IBAction func registerUser(_ sender: UIButton) {
        
        var isRegistered = false
        if(password.text == passwordConfirm.text && !(password.text?.isEmpty)! && !(email.text?.isEmpty)!){
            isRegistered = rest.registerUser(userName: email.text!, password: password.text!)
        }
        if(isRegistered){
            configuration.loginStringBase64 = util.encodeCredentials(email: email.text!, password: password.text!)
            self.performSegue(withIdentifier: "segueRegisterToHome", sender: nil)
        } else {
            let alertController = util.alert(title: "Registrierung fehlgeschlagen", message: "Registrierung konnte nicht durchgeführt werden. Bitte prüfen Sie Ihre Daten und die Serveradresse!")
            self.present(alertController, animated: true, completion: nil)
        }
    }
    
    
    
}
