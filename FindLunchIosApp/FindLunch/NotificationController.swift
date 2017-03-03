//
//  NotificationController.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 04.02.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit
import MapKit

class NotificationController: UIViewController,CLLocationManagerDelegate,MKMapViewDelegate, UITableViewDelegate, UITableViewDataSource {
    
    var daysOfWeek: [DayOfWeek] = [.monday, .tuesday, .wednesday, .thursday, .friday, .saturday, .sunday]
    
    var kitchenTypes: [KitchenType] = [.asian, .bavarian, .greek, .indian, .italian]
    
    var distanceString: String = ""
    var distance: Float = 0
    
    @IBOutlet weak var tableWeekDays: UITableView!
    @IBOutlet weak var tableKitchenTypes: UITableView!
    @IBOutlet weak var map: MKMapView!
    @IBOutlet weak var titleField: UITextField!
    @IBOutlet weak var distanceLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        distanceLabel.text = distanceString
        let nib = UINib(nibName: "SliderCell", bundle: nil)
        tableWeekDays.register(nib, forCellReuseIdentifier: "SliderCell")
        tableKitchenTypes.register(nib, forCellReuseIdentifier: "SliderCell")
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.dismissKeyboard))
        view.addGestureRecognizer(tap)
    }
    
    func dismissKeyboard() {
        view.endEditing(true)
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        centerMap(configuration.myLocation!)
        if(map.annotations.count == 0){
        let annotation: MKPointAnnotation = MKPointAnnotation()
            annotation.coordinate = configuration.myLocation!
            map.addAnnotation(annotation)
        }
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int{
        var count: Int = 0
        if(tableView == tableWeekDays){
            count = daysOfWeek.count
        } else {
            count = kitchenTypes.count
        }
        return count
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell{
        let cell = tableView.dequeueReusableCell(withIdentifier: "SliderCell") as! SliderCell
        if(tableView==tableWeekDays){
            cell.cellLable.text = daysOfWeek[indexPath.row].getGermanDesc()
        } else {
            cell.cellLable.text = kitchenTypes[indexPath.row].getGermanDesc()
        }
        
        return cell
    }
    
    public func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 44
    }
    
    public func chosenDays() -> [DayOfWeek]{
        var chosenDays = [DayOfWeek]()
        let countDays = daysOfWeek.count
        var daysIndexPath = tableWeekDays.indexPathsForVisibleRows
        for index in 0...countDays-1 {
            let cell: SliderCell = tableWeekDays.cellForRow(at: (daysIndexPath?[index])!) as! SliderCell
            
            if(cell.slider.isOn){
                chosenDays.append(daysOfWeek[index])
            }
        }
        return chosenDays
    }
    
    
    public func chosenKitchenTypes() -> [KitchenType]{
        var chosenKitchens = [KitchenType]()
        let countKitchens = kitchenTypes.count
        var kitchenIndexPath = tableKitchenTypes.indexPathsForVisibleRows
        for index in 0...countKitchens-1 {
            let cell: SliderCell = tableKitchenTypes.cellForRow(at: (kitchenIndexPath?[index])!) as! SliderCell
            
            if(cell.slider.isOn){
                chosenKitchens.append(kitchenTypes[index])
            }
        }
        for kitchen in chosenKitchens{
            print(kitchen.getGermanDesc())
        }
        return chosenKitchens
    }
    
    func centerMap(_ center:CLLocationCoordinate2D){
        let spanX = 0.007
        let spanY = 0.007
        
        let newRegion = MKCoordinateRegion(center:center , span: MKCoordinateSpanMake(spanX, spanY))
        map.setRegion(newRegion, animated: true)
    }
    
    @IBAction func saveNotificationButton(_ sender: UIButton) {
        let pushNot = PushNotification(id: -1, title: titleField.text!, gcmToken: configuration.firToken!, latitude: (configuration.myLocation?.latitude)!, longitude: (configuration.myLocation?.longitude)!, radius: Double(distance), days: chosenDays(), kitchenTypes: chosenKitchenTypes())
        
        if(validateNotification(notification: pushNot)){
            if rest.registerPushNotification(pushNotification: pushNot){
                navigationController?.popViewController(animated: true)
            }
        }
    }
    
    func validateNotification(notification: PushNotification) -> Bool{
        
        var isTitleOk = true
        var hasKitchens = true
        var hasDays = true
        
        var message: String = ""
        
        if (titleField.text?.isEmpty)!{
            isTitleOk = false
            message.append("Kein Titel angegeben\n")
        }
        
        if((titleField.text?.characters.count)!>20){
            isTitleOk = false
            message.append("Titel höchsten 20 Zeichen lang\n")
        }
        
        if notification.kitchenTypes.isEmpty{
            hasKitchens = false
            message.append("Keine Restaurantart angegeben\n")
        }
        
        if notification.days.isEmpty{
            hasDays = false
            message.append("Keine Wochentage angegeben\n")
        }
        
        let isOk = isTitleOk && hasKitchens && hasDays
        
        if(!isOk){
        
            let alertController = UIAlertController(title: "Ungültige Eingabe", message: message, preferredStyle: UIAlertControllerStyle.alert)
            alertController.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.default, handler: nil))
            self.present(alertController, animated: true, completion: nil)
        }
        return isOk
    }
    
}
