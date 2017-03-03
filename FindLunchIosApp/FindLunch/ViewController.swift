
//
//  ViewController.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 26.12.16.
//  Copyright © 2016 Hochschule München. All rights reserved.
//

import UIKit
import MapKit
import CoreLocation
import SwiftIconFont
import FirebaseMessaging

class ViewController: UIViewController,CLLocationManagerDelegate,MKMapViewDelegate, UISearchBarDelegate {
    
    let locationManager = CLLocationManager()
    
    @IBOutlet weak var locationButton: UIButton!
    
    @IBOutlet weak var map: MKMapView!
    @IBOutlet weak var distanceLabel: UILabel!
    @IBOutlet weak var searchBar: UISearchBar!
    var myRadius:Float = 5000.00
    
    override func viewDidLoad() {
        super.viewDidLoad()
        searchBar.delegate = self
        locationManager.delegate = self
        locationButton.parseIcon()
        
        // For use in foreground
        self.locationManager.requestWhenInUseAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            locationManager.delegate = self
            locationManager.desiredAccuracy = kCLLocationAccuracyBest
            
        }
        determineCurrentLocation()
        
        map.delegate = self
        map.mapType = .standard
        map.isZoomEnabled = true
        map.isScrollEnabled = true
        
        
        addLongPressGesture()
    }
    
    func determineCurrentLocation()
    {
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            locationManager.startUpdatingLocation()
        }
    }
    
    func locationManager(_ manager: CLLocationManager,
                         didUpdateLocations locations: [CLLocation]) {
        let userLocation:CLLocation = locations[0] as CLLocation
        
        // Call stopUpdatingLocation() to stop listening for location updates,
        // other wise this function will be called every time when user location changes.
        manager.stopUpdatingLocation()
        
        let center = CLLocationCoordinate2D(latitude: userLocation.coordinate.latitude, longitude: userLocation.coordinate.longitude)
        configuration.myLocation = userLocation.coordinate
        centerMap(center)
        
        let coordinate = CLLocationCoordinate2DMake(userLocation.coordinate.latitude, userLocation.coordinate.longitude);
        setAnnotation(coordinate: coordinate)
        
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error)
    {
        print("Error \(error)")
    }
    
    func addLongPressGesture(){
        let longPressRecogniser:UILongPressGestureRecognizer = UILongPressGestureRecognizer(target:self , action:#selector(ViewController.handleLongPress(_:)))
        longPressRecogniser.minimumPressDuration = 1.0 //user needs to press for 2 seconds
        self.map.addGestureRecognizer(longPressRecogniser)
    }
    
    func handleLongPress(_ gestureRecognizer:UIGestureRecognizer){
        if gestureRecognizer.state != .began{
            return
        }
        
        let touchPoint:CGPoint = gestureRecognizer.location(in: self.map)
        let touchMapCoordinate:CLLocationCoordinate2D =
            self.map.convert(touchPoint, toCoordinateFrom: self.map)
        
        setAnnotation(coordinate: touchMapCoordinate)
        centerMap(touchMapCoordinate)
    }
    
    
    func setAnnotation(coordinate: CLLocationCoordinate2D){
        let annotation: MKPointAnnotation = MKPointAnnotation()
        annotation.coordinate = coordinate
        print(self.map.annotations.count)
        if self.map.annotations.count != 0 {
            self.map.removeAnnotations(self.map.annotations)
        }
        
        self.map.addAnnotation(annotation)
        print(self.map.annotations.count)
    }
    
    func centerMap(_ center:CLLocationCoordinate2D){
        configuration.myLocation = center
        let spanX = 0.007
        let spanY = 0.007
        
        let newRegion = MKCoordinateRegion(center:center , span: MKCoordinateSpanMake(spanX, spanY))
        map.setRegion(newRegion, animated: true)
    }
    
    
    @IBAction func searchButton(_ sender: UIButton) {
        let myLocation = configuration.myLocation
        let list = rest.getRestaurants(longitude: (myLocation?.longitude)!, latitude: (myLocation?.latitude)!, radiusInMetres: Int(myRadius))
        let myVC = storyboard?.instantiateViewController(withIdentifier: "RestaurantsTableViewController") as! RestaurantsTableViewController
        myVC.list = list
        navigationController?.pushViewController(myVC, animated: true)
    }
    
    func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView?{
        let identifier = "pin"
        var view : MKPinAnnotationView
        if let dequeueView = mapView.dequeueReusableAnnotationView(withIdentifier: identifier) as? MKPinAnnotationView{
            dequeueView.annotation = annotation
            view = dequeueView
        }else{
            view = MKPinAnnotationView(annotation: annotation, reuseIdentifier: identifier)
            view.canShowCallout = true
            view.calloutOffset = CGPoint(x: -5, y: 5)
            view.rightCalloutAccessoryView = UIButton(type: .detailDisclosure)
        }
        view.pinTintColor =  .red
        return view
    }
    
    @IBAction func sliderValueChanged(_ sender: UISlider) {
        let step: Float = 10
        let roundedValue = round(sender.value / step) * step
        myRadius = roundedValue
        sender.value = myRadius
        distanceLabel.text = generateRadiusString()
    }
    
    func generateRadiusString() -> String{
        let km = myRadius/1000 as NSNumber
        
        let formatter = NumberFormatter()
        formatter.decimalSeparator = ","
        formatter.numberStyle = .decimal
        let kmString = formatter.string(from: km)
        
        return kmString! + " km"
    }
    
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar){
        searchBar.resignFirstResponder()
        
        let localSearchRequest = MKLocalSearchRequest()
        localSearchRequest.naturalLanguageQuery = searchBar.text
        let localSearch = MKLocalSearch(request: localSearchRequest)
        localSearch.start { (localSearchResponse, error) -> Void in
            
            if localSearchResponse == nil{
                let alertController = UIAlertController(title: nil, message: "Ort nicht gefunden", preferredStyle: UIAlertControllerStyle.alert)
                alertController.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
                self.present(alertController, animated: true, completion: nil)
                return
            }
            
            let coordinate = CLLocationCoordinate2D(latitude: localSearchResponse!.boundingRegion.center.latitude, longitude:     localSearchResponse!.boundingRegion.center.longitude)
            
            self.centerMap(coordinate)
            self.setAnnotation(coordinate: coordinate)
        }
    }
    
    @IBAction func locationButton(_ sender: Any) {
        determineCurrentLocation()
    }

    @IBAction func pushButton(_ sender: Any) {
        let notificationController = storyboard?.instantiateViewController(withIdentifier: "NotificationController") as! NotificationController
        notificationController.distanceString = generateRadiusString()
        notificationController.distance = myRadius
        navigationController?.pushViewController(notificationController, animated: true)
        
    }
}

