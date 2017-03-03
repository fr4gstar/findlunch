//
//  RestaurantsTableViewController.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 16.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit

class RestaurantsTableViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    var list: [Restaurant] = [Restaurant]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func didReceiveMemoryWarning(){
        super.didReceiveMemoryWarning()
    
    }
    
    internal func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int{
        return list.count
    }
    

    internal func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell{
        let restaurant = list[indexPath.row]
        let cell = Bundle.main.loadNibNamed("DetailsCell", owner: self, options: nil)?.first as! DetailsCell
        cell.title.text = restaurant.name
        cell.details.text = "Distanz: " + String(describing: restaurant.distance!) + " m"
        cell.favorite.isHidden = !restaurant.isFavorite!
        cell.favorite.parseIcon()
        return cell
    }
    
    
    internal func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath){
        let myVC = storyboard?.instantiateViewController(withIdentifier: "RestaurantController") as! RestaurantController
        myVC.restaurant = list[indexPath.row]
        navigationController?.pushViewController(myVC, animated: true)
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 63
    }
    
}
