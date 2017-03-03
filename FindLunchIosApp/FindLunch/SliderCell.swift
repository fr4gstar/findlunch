//
//  SliderCell.swift
//  FindLunch
//
//  Created by Wilhelm Laschinger on 04.02.17.
//  Copyright © 2017 Hochschule München. All rights reserved.
//

import UIKit

class SliderCell: UITableViewCell {

    @IBOutlet weak var cellLable: UILabel!
    @IBOutlet weak var slider: UISwitch!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
}
