
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { usuario } from '../_models/usuario';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<usuario>;
    public currentUser$: Observable<usuario>;
    private apiUrl: string = 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/usuario/authenticate';

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<usuario>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): usuario {
        return this.currentUserSubject.getValue();
    }

    login(username: string, password: string) {
        // console.log(username);
        // console.log(password);
        // console.log(this.apiUrl);
        return this.http.post<any>(`${this.apiUrl}`, { username, password }, this.deductHeader())
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                console.log(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('username');
        this.currentUserSubject.next(null);
    }

    setUserName(username: string) {
        sessionStorage.setItem('username', JSON.stringify(username));
    }

    getUserName() {
        return JSON.parse(sessionStorage.getItem('username'));
    }

    protected deductHeader() {
        return { headers: this.hasToken() ? this.securityHeaders() : this.headers() };
    }

    protected headers(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json'
        });
    }

    protected securityHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.getToken()
        });
    }

    protected getCurrentUser() {
        const ret = localStorage.getItem('currentUser');
        if (ret) {
            return JSON.parse(ret);
        }

        return null;
    }

    public getToken(): string {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            return currentUser.token;
        }

        return null;
    }

    hasToken(): boolean {
        const jwt = this.getToken();
        return jwt != null && jwt !== '';
    }
}
