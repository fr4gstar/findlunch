//
//  OfferController.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 19.01.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit

class OfferController: UIViewController {
    
    @IBOutlet weak var offerImage: UIImageView!
    @IBOutlet weak var offerTitle: UILabel!
    @IBOutlet weak var offerStartTime: UILabel!
    @IBOutlet weak var offerEndTime: UILabel!
    @IBOutlet weak var offerWeekDays: UILabel!
    @IBOutlet weak var offerDescription: UITextView!
    
    var offer: Offer? = nil
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if let offerForView = offer {
            if let imageString = offerForView.imageString {
                let data = Data(base64Encoded: imageString)
                let image = UIImage(data: data!)
                offerImage.image = image
                offerImage.contentMode = .scaleAspectFit
            } else {
                offerImage.image = UIImage(named: "defaultPhoto")
            }
            
            offerTitle.text = offerForView.title
            offerStartTime.text = configuration.dateFormatterView.string(from: offerForView.startTime)
            offerEndTime.text = configuration.dateFormatterView.string(from: offerForView.endTime)
            offerWeekDays.text = offerForView.daysOfWeekAsString()
            offerDescription.text = offerForView.description
        }
        
    }

}
