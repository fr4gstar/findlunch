//
//  LoginController.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 26.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit
class LoginController: Controller, UITextFieldDelegate {
 
    @IBOutlet weak var email: UITextField!
    @IBOutlet weak var password: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        configuration.serverAddress = configuration.defaultServerAddress
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        email.delegate = self
        password.delegate = self
    }
    
    @IBAction func login(_ sender: UIButton) {
        performLogin()
    }
    
    func performLogin(){
        if(configuration.serverAddress == nil){
            configuration.serverAddress=configuration.defaultServerAddress
        }
        configuration.loginStringBase64 = util.encodeCredentials(email: email.text!, password: password.text!)
        
        let isUserLoggedIn = rest.login()
        if(isUserLoggedIn == false){
            let alertController = util.alert(title: "Anmeldung fehlgeschlagen", message: "Zugangsdaten und Serveradresse prüfen!")
            self.present(alertController, animated: true, completion: nil)
        } else {
            self.performSegue(withIdentifier: "loginSegue", sender: nil)
        }
    }
    
    @IBAction func prepareForUnwind(segue: UIStoryboardSegue){
    }
    
    @IBAction func navigateToRegistering(_ sender: UIButton) {
        
        let myVC = storyboard?.instantiateViewController(withIdentifier: "RegisterController") as! RegisterController
        navigationController?.pushViewController(myVC, animated: true)

    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool
    {
        if (textField === email) {
            password.becomeFirstResponder()
        } else if (textField === password) {
            performLogin()
            password.resignFirstResponder()
        }
        
        return true
    }
    
    
    @IBAction func registerButton(_ sender: Any) {
        tabBarController?.selectedIndex = 2
    }
}
