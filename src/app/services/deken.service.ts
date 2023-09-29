import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DekenService {
    baseUrl = environment.apiBaseUrl + '/deken/';

  constructor(private http: HttpClient) { }

  getAddress(name: string, addressObserver: {next: (url: string) => void, error: (error: any) => void}):
  Subscription {
    // assume MacOs just for getting object names & descriptions (seems well supported)
    return this.http.get(this.baseUrl + name, {responseType: "text"}).subscribe({
      next: (value: string) => {
        addressObserver.next(value);
      },
      error: (error: any) => {
        console.log("in error");
        addressObserver.error(error);
      }
    });
  }
}
