import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions} from "@angular/http";
import {SERVER_URL} from "../app/app.module";
import {HomePage} from "../pages/home/home";




@Injectable()
export class AuthService {
    error : any;
  constructor(private http: Http) {
  }

  public login(userName: string, password: string) {
    console.log("in auth-service login angekommen");
    let encodedCredentials: string = btoa(userName + ":" + password);
    console.log(encodedCredentials);
    let headers = new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic " + encodedCredentials
    });

    let options = new RequestOptions({headers: headers});
    return new Promise(resolve => {
      this.http.get(SERVER_URL + "/api/login_user", options).subscribe(
        (res) => {
          console.log("api call erfolgreich");
          window.localStorage.setItem(userName, encodedCredentials);

          resolve(true);
        }, (err) => {
          console.log("hier isch der fähler");
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

public register(userName: string, password: string) {
  let user = { username : userName,
               password : password
  }


  let headers = new Headers({
    'Content-Type': 'application/json',
    "Authorization": "Basic aW9uaWNAaW9uaWMuY29tOiExMjM0NTY3OE5p"
  });
  let options = new RequestOptions({ headers: headers });

  return new Promise( (resolve, reject) => {
    this.http.post(SERVER_URL+"/api/register_user", user , options).subscribe(
      (res) => {
        //Bei erfolgreicher Registrierung direkt Login
      //  this.login(userName, password);
        resolve(true);
      }, (err) => {
        console.log("registry hat nicht funktioniert \n ErrorCode:" + err._body);
        reject(err._body);

      })
  })
}


  public getUserInfo() {
  }

  public logout() {

  }
}
