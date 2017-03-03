//
//  NotificationsControllerViewController.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 04.02.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit

class NotificationsController: UIViewController, UITableViewDelegate, UITableViewDataSource{

    var list: [PushNotification] = [PushNotification]()
    
    @IBOutlet weak var tableView: UITableView!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationController?.navigationBar.backgroundColor = UIColor.black
        navigationController?.navigationBar.tintColor = UIColor.red
        // Do any additional setup after loading the view.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        tableView.reloadData()
        
    }
    
    internal func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int{
        list = rest.getPushNotifications()
        return list.count
    }
    
    internal func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell{
        let cell = Bundle.main.loadNibNamed("DefaultCell", owner: self, options: nil)?.first as! DefaultCell
        cell.title.text = self.list[indexPath.row].title
        return cell
    }
    
    internal func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        return true
    }
    
    internal func tableView(_ tableView: UITableView, editActionsForRowAt: IndexPath) -> [UITableViewRowAction]? {
        let delete = UITableViewRowAction(style: .normal, title: "Löschen") { action, index in
            let pushNotification = self.list[index.row]
            if rest.removePushNotification(pushNotificationId: pushNotification.id){
                self.list.remove(object: pushNotification)
                tableView.reloadData()
            }
        }
        delete.backgroundColor = .red
        
        return [delete]
    }
}
