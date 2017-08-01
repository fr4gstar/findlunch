import {Injectable} from "@angular/core";
import {Headers, Http, RequestMethod, RequestOptions, Response} from "@angular/http";
import {SERVER_URL} from "../app/app.module";
import {User} from "../model/User";
import {Observable} from "rxjs/Observable";

/**
 * Service that handles everything about login, verification and registration of users of the App.
 *
 * @author Skanny Morandi - refactored by Sergej Bardin
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
    public login(username: string, password: string): Observable<any> {
        const encodedCredentials: string = btoa(`${username}:${password}`);
        const headers: Headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: `Basic ${encodedCredentials}`
        });

        const options: RequestOptions = new RequestOptions({headers: headers});
        return this.http.get(`${SERVER_URL}/api/login_user`, options).do(
                (res: Response) => {
                    window.localStorage.setItem("username", username);
                    window.localStorage.setItem(username, encodedCredentials);
                    this.userName = window.localStorage.getItem("username");
                    this.loggedIn = true;
                });
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
    // TODO
    public register(username: string, password: string) {
        const user: User = {
            username: username,
            password: password
        };


        const headers: Headers = new Headers({
            'Content-Type': 'application/json'
        });
        const options: RequestOptions = new RequestOptions({headers: headers});
    // TODO
        return new Promise((resolve, reject) => {
            this.http.post(`${SERVER_URL}/api/register_user`, user, options).subscribe(
                (res: Response) => {
                    const encodedCredentials: string = btoa(`${username}:${password}`);
                    window.localStorage.setItem("username", username);
                    window.localStorage.setItem(username, encodedCredentials);
                    this.userName = window.localStorage.getItem("username");
                    this.loggedIn = true;
                    resolve(true);
                }, (err) => {
                    reject(err._body);

                });
        });
    }

    /**
     * verifies whether the user stored in the local storage is still existent in backend database.
     * If no more existent, logs the user out
     * @returns {Promise<T>}
     */
    // TODO
    public verifyUser() {
        //if there is a username stored at all in the local storage...
        if (window.localStorage.getItem("username") !== null) {

            //retrieve it...
            const currentUser: string = window.localStorage.getItem("username");
            const headers: Headers = new Headers({
                'Content-Type': 'application/json',
                //also retrieve the according token and put it into the header of the http-call
                Authorization: "Basic " + window.localStorage.getItem(currentUser)
            });
// TODO
            const options: RequestOptions = new RequestOptions({headers: headers});
            return new Promise((resolve) => {
                this.http.get(SERVER_URL + "/api/login_user", options).subscribe(
                    (res: Response) => {
                        //if verification successful..
                        this.loggedIn = true;
                        this.userName = currentUser;
                        //else..
                    },
                    (err: Error) => {
                        console.warn("Verifiying user failed.", err);
                        this.logout();
                    });
            });
        }
    }

    /**
     * Returns whether the current user is verified, aka his "logged in"-status
     * @returns {boolean}
     * logged-in status of user
     */
    public getLoggedIn(): boolean {
        return this.loggedIn;
    }

    /**
     * Gets username of the current User
     * @returns {string}
     *  username of current user
     */
    public getUserName(): string {
        return this.userName;
    }

    /**
     * logs the current user out. Clears his username and token from the local storage.
     */
    public logout(): void {
        const currentUser: string = window.localStorage.getItem("username");

        //delete key-value pair stored under the key named after the most recently logged in user
        window.localStorage.removeItem(currentUser);
        // delete latest logged in user stored under key "username"
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
    public prepareHttpOptions(reqMethod: RequestMethod): RequestOptions {

        let options: RequestOptions;
        let headers: Headers;

        if (this.getLoggedIn()) {
            const user: string = window.localStorage.getItem("username");
            const token: string = window.localStorage.getItem(user);
            headers = new Headers({
                'Content-Type': 'application/json',
                Authorization: `Basic ${token}`
            });
        }

        options = new RequestOptions({
            headers: headers,
            method: reqMethod
        });
        return options;
    }
}
