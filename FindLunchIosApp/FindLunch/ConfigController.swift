//
//  ConfigController.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 25.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit

class ConfigController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var serverAddress: UITextField!
    @IBOutlet weak var logoutButton: UIButton!
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        serverAddress.text = configuration.serverAddress
        serverAddress.delegate = self

    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        let hideButton = configuration.loginStringBase64 == nil
        logoutButton.isHidden = hideButton
    }

    
    @IBAction func serverAddressChanged(_ sender: UITextField) {
        print(sender.text!)
        configuration.serverAddress = sender.text
    }
    
    @IBAction func logout(_ sender: UIButton) {
        //segueLogout
        configuration.myLocation = nil
        configuration.loginStringBase64 = nil
        self.performSegue(withIdentifier: "segueLogout", sender: self)
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool
    {
        if (textField === serverAddress) {
            serverAddress.resignFirstResponder()

        }
        return true
    }
}
