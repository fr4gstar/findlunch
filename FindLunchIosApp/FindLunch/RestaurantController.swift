//
//  RestaurantController.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 19.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit
import MapKit

class RestaurantController: UIViewController, MKMapViewDelegate, UITableViewDelegate, UITableViewDataSource {

    var restaurant: Restaurant? = nil
    var offers: [Offer] = [Offer]()
    var favRestaurants: [Restaurant] = [Restaurant]()
    var isRestaurantFav: Bool = false
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var kitchenTypes: UILabel!
    @IBOutlet weak var adressLabel: UILabel!
    @IBOutlet weak var zipCityLabel: UILabel!
    @IBOutlet weak var distanceLabel: UILabel!
    @IBOutlet weak var map: MKMapView!
    @IBOutlet weak var favoriteButton: UIButton!
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if let restaurantForView = restaurant{
            map.delegate = self
            map.mapType = .standard
            map.isZoomEnabled = true
            map.isScrollEnabled = true
            
            let newRegion = MKCoordinateRegion(center: (restaurantForView.location)!, span: MKCoordinateSpanMake(0.007, 0.007))
            map.setRegion(newRegion, animated: true)
            let annot:MKPointAnnotation = MKPointAnnotation()
            annot.coordinate = (restaurantForView.location)!
            map.addAnnotation(annot)
            
            nameLabel.text = restaurantForView.name
            kitchenTypes.text = restaurantForView.kitchenTypesAsString()
            adressLabel.text = restaurantForView.address
            zipCityLabel.text = (restaurantForView.zip)! + " " + (restaurantForView.city)!
            distanceLabel.text = String(describing: (restaurantForView.distance)!) + " m"
            
            offers = rest.getOffers(restaurant: restaurantForView)
            favRestaurants = rest.getFavoriteRestaurants(longitude: (configuration.myLocation?.longitude)!, latitude: (configuration.myLocation?.latitude)!)
            
            isRestaurantFav = favRestaurants.contains(restaurant!)
            updateFavButtonText()
            
        }
        
    }
    
    override func viewDidAppear(_ animated: Bool) {
        favRestaurants = rest.getFavoriteRestaurants(longitude: (configuration.myLocation?.longitude)!, latitude: (configuration.myLocation?.latitude)!)
        isRestaurantFav = favRestaurants.contains(restaurant!)
        updateFavButtonText()
    }
    
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int{
        return offers.count
    }
    
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell{
        let cell = Bundle.main.loadNibNamed("ImageCell", owner: self, options: nil)?.first as! ImageCell
        let offer: Offer = offers[indexPath.row]
        cell.title.text = offer.title
        
        let image: UIImage
        if let imageString = offer.imageString {
            let data = Data(base64Encoded: imageString)
            image = UIImage(data: data!)!

        } else {
            image = UIImage(named: "defaultPhoto")!
        }
        cell.cellImageView.image = image
        
        return cell
    }
    
    public func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 60
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath){
        let offerC = storyboard?.instantiateViewController(withIdentifier: "OfferController") as! OfferController
        offerC.offer = offers[indexPath.row]
        navigationController?.pushViewController(offerC, animated: true)
    }
    
    @IBAction func addToFavorites(_ sender: UIButton) {
        if(isRestaurantFav){
            let removed = rest.removeFavorite(restaurantId: restaurant!.id)
            if(removed){
                favRestaurants.remove(object: restaurant!)
                isRestaurantFav = false
            }
        }else {
            let added = rest.addRestaurantToFavorites(restaurantId: restaurant!.id)
            if (added){
                favRestaurants.append(restaurant!)
                isRestaurantFav = true
            }
        }
        updateFavButtonText()
    }
    
    
    func updateFavButtonText() {
        if(isRestaurantFav){
            favoriteButton.setTitle("fa:star", for: .normal)
        } else {
            favoriteButton.setTitle("fa:star-o", for: .normal)
        }
        favoriteButton.parseIcon()
    }
}
