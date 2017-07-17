import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Loading, LoadingController} from "ionic-angular";


@Injectable()
export class LoadingService{

    constructor(public loadingCtrl: LoadingController) {


    }

    prepareLoader(message?: string) : Loading {
        if (message!== null){

            let loader = this.loadingCtrl.create({
                content: message
          //      duration: 3000,
            });

            return loader;
        }


    }


}
