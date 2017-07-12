import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Loading, LoadingController} from "ionic-angular";


@Injectable()
export class LoadingService{

    constructor(public loadingCtrl: LoadingController) {


    }

    prepareLoader(message) : Loading {
        let loader = this.loadingCtrl.create({
            content: message,
      //      duration: 3000,
      //      dismissOnPageChange : true
        });

        return loader;


    }


}
