import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Loading, LoadingController} from "ionic-angular";


@Injectable()
export class LoadingService {

    constructor(public loadingCtrl: LoadingController) {


    }

    prepareLoader(): Loading {
        let loader = this.loadingCtrl.create({});

        return loader;


    }


}
