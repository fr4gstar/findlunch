import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { LoadingController } from "ionic-angular";


@Injectable()
export class LoadingService{

    constructor(public loadingCtrl: LoadingController) {

    }

    presentLoading(message) {
        let loader = this.loadingCtrl.create({
            content: message,
            duration: 3000,
            dismissOnPageChange : true
        });

            loader.present();


    }

}
