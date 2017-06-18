import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../app/app.module";
import {HomePage} from "../pages/home/home";




@Injectable()
export class AuthService {
      private loggedIn: boolean;

  constructor(private http: Http) {

  }

  public login(username: string, password: string) {
    console.log("in auth-service login angekommen");
    let encodedCredentials: string = btoa(username + ":" + password);
    console.log(encodedCredentials);
    let headers = new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic " + encodedCredentials
    });

    let options = new RequestOptions({headers: headers});
    return new Promise(resolve => {
      this.http.get(SERVER_URL + "/api/login_user", options).subscribe(
        (res) => {
          window.localStorage.setItem("username", username);
          window.localStorage.setItem(username, encodedCredentials);
          this.loggedIn = true;
          resolve(true);
        }, (err) => {
          resolve(err.body);


        })
    })
  }


  /**
   * Registriert User und Loggt user direkt ein
   * @param userName
   * @param password
   * @returns {Promise<T>}
   */

  public register(username: string, password: string) {
    let user = { username : username,
                 password : password
    }


    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    let options = new RequestOptions({ headers: headers });

    return new Promise( (resolve, reject) => {
      this.http.post(SERVER_URL+"/api/register_user", user , options).subscribe(
        (res) => {
          //Bei erfolgreicher Registrierung direkt Login
          this.login(username, password);
          resolve(true);
        }, (err) => {
          reject(err._body);

        })
    })
  }


  public verifyUser() {
    //zuletzt eingeloggter user
    if(window.localStorage.getItem("username")!== null){

      let currentUser = window.localStorage.getItem("username");
      let headers = new Headers({
        'Content-Type': 'application/json',
        //token zum zuletzt eingeloggten user, gespeichert als value zum key der Variable currentuser
        "Authorization": "Basic " + window.localStorage.getItem(currentUser)
      });

      let options = new RequestOptions({headers: headers});
      return new Promise((resolve) => {
        this.http.get(SERVER_URL + "/api/login_user", options).subscribe(
          (res) => {
            this.loggedIn = true;
          }, (err) => {
            this.logout();
          })
      })
    }
  }

  public getLoggedIn(){
    return this.loggedIn;
  }

  public logout(){
    let currentUser = window.localStorage.getItem("username");
    //lösche key-value paar gespeichert unter dem zuletzt eingeloggten namen bzw Variable currentUser
    window.localStorage.removeItem(currentUser);
    //lösche den zuletzt eingeloggten usernamen gesetzt unter dem key-String "username"
    window.localStorage.removeItem("username");
    this.loggedIn = false;
  }
}
