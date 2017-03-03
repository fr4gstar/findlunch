//
//  FavoriteController.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 28.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit

class FavoriteController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    var list: [Restaurant] = [Restaurant]()
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        tableView.reloadData()
        
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int{
        list = rest.getFavoriteRestaurants(longitude: (configuration.myLocation?.longitude)!, latitude: (configuration.myLocation?.latitude)!)
        return list.count
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell{
        let cell = Bundle.main.loadNibNamed("DetailsCell", owner: self, options: nil)?.first as! DetailsCell
        let restaurant = list[indexPath.row]
        cell.title.text = restaurant.name
        cell.details.text = "Distanz: " + String(describing: restaurant.distance!) + " m"
        cell.favorite.isHidden = true
        return cell
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath){
        let myVC = storyboard?.instantiateViewController(withIdentifier: "RestaurantController") as! RestaurantController
        myVC.restaurant = list[indexPath.row]
        navigationController?.pushViewController(myVC, animated: true)
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 63
    }
    
    public func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        return true
    }
    
    public func tableView(_ tableView: UITableView, editActionsForRowAt: IndexPath) -> [UITableViewRowAction]? {
        let delete = UITableViewRowAction(style: .normal, title: "Löschen") { action, index in
            let restaurant = self.list[index.row]
            if rest.removeFavorite(restaurantId: restaurant.id){
                self.list.remove(object: restaurant)
                tableView.reloadData()
            }
        }
        delete.backgroundColor = .red
        
        return [delete]
    }
    
    
    
}
