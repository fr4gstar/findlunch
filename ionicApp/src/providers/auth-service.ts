import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../app/app.module";
import {HomePage} from "../pages/home/home";




@Injectable()
export class AuthService {

  constructor(private http: Http){

}

  public login(userName: string, password: string) {
    console.log("in auth-service login angekommen");
    let encodedCredentials: String = btoa(userName+":"+password);
    console.log(encodedCredentials);
    let headers = new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic " + encodedCredentials
    });

    let options = new RequestOptions({headers: headers});
    this.http.get(SERVER_URL + "/api/login_user", options).subscribe(
      (res) => {
        console.log("api call erfolgreich");
        window.localStorage.setItem(userName,"loggedIn");

        return true;
      }, (err) => {
           console.log("hier isch der fähler");
           return false;


      })
  }

  public register(credentials) {

  }

  public getUserInfo() {
  }

  public logout() {

  }
}
