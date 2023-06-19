import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterPayload } from '../models/register-payload';
import { Auth } from '../models/auth';
import { LoginPayload } from '../models/login-payload';
import jwtDecode, { JwtPayload } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth | null = null;
  loggedIn: boolean = false;
  expDate: Date | null = null;
  baseUrl='http://localhost:8080/puredatabase2/api'

  private unsetAuth() {
    this.auth = null;
    this.loggedIn = false;
    this.expDate = null;
  }

  constructor(private http: HttpClient) {
    let stringAuth: string | null = localStorage.getItem("auth");
    if(typeof(stringAuth) === "string") {
      const auth: Auth = JSON.parse(stringAuth);
      let dateNum: number = jwtDecode<JwtPayload>(auth?.token!).exp!;
      const expDate: Date = new Date(dateNum*1000);
      const currentDate: Date = new Date();
      if(expDate.getTime() < currentDate.getTime()) {
        localStorage.removeItem("auth");
      } else {
        this.loggedIn = true;
        this.expDate = expDate;
        this.auth = auth;
      }
    }
  }

  postWithAuth<T>(urlSuffix: string, payload: T, observableVals: {next: (value: any) => void, error: (error: string) => void}) {
    if(this.auth != null) {
      const currentDate: Date = new Date();
      if(this.expDate!.getTime() < currentDate.getTime()) return observableVals.error("Login Expired");
      let token: string = this.auth.token!;
      this.http.post<void>(`${this.baseUrl}/${urlSuffix}`, {headers: {"auth-token": token}}).subscribe({
        next: value => {
          observableVals.next(value);
        },
        error: error => {
          observableVals.error(error.error.message);
        }
      })
    } else observableVals.error("Please log in");
  }

  getWithAuth<T>(urlSuffix: string, observableVals: {next: (value: any) => void, error: (error: string) => void}) {
    if(this.auth != null) {
      const currentDate: Date = new Date();
      if(this.expDate!.getTime() < currentDate.getTime()) return observableVals.error("Login Expired");
      let token: string = this.auth.token!;
      this.http.get<T>(`${this.baseUrl}/${urlSuffix}`, {headers: {"auth-token": token}}).subscribe({
        next: value => {
          observableVals.next(value);
        },
        error: error => {
          observableVals.error(error.error.message);
        }
      })
    } else observableVals.error("Please log in");
  }

  check(observableVals: {next: (value: any) => void, error: (error:any) => void}): void {
    this.getWithAuth("auth/check", {
      next: value => {
        observableVals.next(null);
      },
      error: error => {
        observableVals.error(null);
      }
    })
  }

  register(payload: RegisterPayload, observableVals: {next: (value: any) => void, error: (error:any) => void}):
  void {
    this.http.post<Auth>(`${this.baseUrl}/auth/register`, payload).subscribe({
      next: value => {
        this.auth = null;
        this.loggedIn = false;
        this.expDate = null;
        observableVals.next(null);
      },
      error: error => {
        observableVals.error(error.error.message);
      }
    })
  }

  login(payload: LoginPayload, observableVals: {next: (value: any) => void, error: (error:any) => void}):
  void {
    this.http.post<Auth>(`${this.baseUrl}/auth/login`, payload).subscribe({
      next: (value: Auth) => {
        this.auth = value;
        this.expDate = new Date(jwtDecode<JwtPayload>(value.token!).exp!);
        localStorage.setItem("auth", JSON.stringify(value))
        this.loggedIn = true;
        observableVals.next(null);
      },
      error: error => {
        this.auth = null;
        this.loggedIn = false;
        this.expDate = null;
        observableVals.error(error.error.message);
      }
    })
  }

  logout(): void {
    localStorage.removeItem("auth");
    this.loggedIn = false;
    this.auth = null;
  }
}
