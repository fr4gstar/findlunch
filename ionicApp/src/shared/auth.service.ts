import {Injectable} from "@angular/core";
import {Headers, Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {SERVER_URL} from "../app/app.module";

/**
 * Service that handles everything about login, verification and registration of users of the App.
 */
@Injectable()
export class AuthService {
    private loggedIn: boolean;
    private userName: string;

    constructor(private http: Http) {

    }

    /**
     * Checks whether the username and password provided are present in the backend database.
     * if yes, this method writes the credentials into the local storage of the device,
     * to make it available even after closing the app and therefore the user doesn't have to login
     * on every startup
     *
     * @param username
     * username, the user's e-mail adress
     * @param password
     * password of the user
     * @returns {Promise<T>}
     * result returned to the method that called the login-functionality
     */
    public login(username: string, password: string) {
        let encodedCredentials: string = btoa(username + ":" + password);
        let headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": "Basic " + encodedCredentials
        });

        let options = new RequestOptions({headers: headers});
        return new Promise(resolve => {
            this.http.get(SERVER_URL + "/api/login_user", options).subscribe(
                (res: Response) => {
                    window.localStorage.setItem("username", username);
                    window.localStorage.setItem(username, encodedCredentials);
                    this.userName = window.localStorage.getItem("username");
                    this.loggedIn = true;

                    resolve(true);
                }, (err) => {
                    resolve(err.body);
                })
        })
    }


    /**
     * Registers user and if successful also directly logs the user in.
     * @param userName
     *  chosen username
     * @param password
     *  chose password
     * @returns {Promise<T>}
     *  result whether registration was successful returned to the calling method
     */

    public register(username: string, password: string) {
        let user = {
            username: username,
            password: password
        }


        let headers = new Headers({
            'Content-Type': 'application/json',
        });
        let options = new RequestOptions({headers: headers});

        return new Promise((resolve, reject) => {
            this.http.post(SERVER_URL + "/api/register_user", user, options).subscribe(
                (res) => {
                    //On successful registration -> login
                    this.login(username, password);
                    resolve(true);
                }, (err) => {
                    reject(err._body);

                })
        })
    }

    /**
     * verifies whether the user stored in the local storage is still existent in backend database.
     * If no more existent, logs the user out
     * @returns {Promise<T>}
     */
    public verifyUser() {
        //if there is a username stored at all in the local storage...
        if (window.localStorage.getItem("username") !== null) {

            //retrieve it...
            let currentUser = window.localStorage.getItem("username");
            let headers = new Headers({
                'Content-Type': 'application/json',
                //also retrieve the according token and put it into the header of the http-call
                "Authorization": "Basic " + window.localStorage.getItem(currentUser)
            });

            let options = new RequestOptions({headers: headers});
            return new Promise((resolve) => {
                this.http.get(SERVER_URL + "/api/login_user", options).subscribe(
                    (res) => {
                        //if verification successful..
                        this.loggedIn = true;
                        this.userName = currentUser;
                        //else..
                    }, (err) => {
                        this.logout();
                    })
            })
        }
    }

    /**
     * Returns whether the current user is verified, aka his "logged in"-status
     * @returns {boolean}
     * logged-in status of user
     */
    public getLoggedIn() {
        return this.loggedIn;
    }

    /**
     * Gets username of the current User
     * @returns {string}
     *  username of current user
     */
    public getUserName() {
        return this.userName;
    }

    /**
     * logs the current user out. Clears his username and token from the local storage.
     */
    public logout() {
        let currentUser = window.localStorage.getItem("username");

        //delete key-value pair stored under the key named after the most recently logged in user
        window.localStorage.removeItem(currentUser);

        //lösche den zuletzt eingeloggten usernamen gesetzt unter dem key-String "username"
        window.localStorage.removeItem("username");
        this.loggedIn = false;
        this.userName = "";
    }


    /**
     * prepares the options object for http-requests. If user is logged in, authentication header
     * is sent along, otherwise RequestHeaders get sent along "empty".
     * @param ReqMethod
     * Request method that represents the http-method used
     * RequestMethod.Get .Put .Delete .Post etc.
     */
    public prepareHttpOptions(ReqMethod: RequestMethod): RequestOptions {

        let options;
        let headers;

        if (this.getLoggedIn()) {
            let user = window.localStorage.getItem("username");
            let token = window.localStorage.getItem(user);
            headers = new Headers({
                'Content-Type': 'application/json',
                "Authorization": "Basic " + token
            });
        }

        options = new RequestOptions({
            headers: headers,
            method: ReqMethod
        })

        return options;
    }
}
