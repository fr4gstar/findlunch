import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Loading, LoadingController} from "ionic-angular";

@Injectable()
export class LoadingService {

    constructor(public loadingCtrl: LoadingController) {
    }
    public prepareLoader(): Loading {
        return this.loadingCtrl.create({
            spinner: "circles"
        });
    }
}
