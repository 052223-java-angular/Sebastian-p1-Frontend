import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DekenService {

  constructor(private http: HttpClient) { }

  getLibrary(name: string, url: string, dekLibObserver: {next: (objects: any) => void, error: (error: any) => void}):
  Subscription {
    return this.http.get<any>(`https://deken.puredata.info/info.json?url=${url}`).subscribe({
      next(value: any) {
        let library = value.result.libraries[name];
        let objects: {name: string, description: string}[] = library[Object.keys(library)[0]][0].objects;
        dekLibObserver.next(objects);
      },
      error: dekLibObserver.error
    });
  }

  getAddress(name: string, addressObserver: {next: (url: string) => void, error: (error: any) => void}):
  Subscription {
    // assume MacOs just for getting object names & descriptions (seems well supported)
    return this.http.get<any>(`https://deken.puredata.info/library/${name}/*/Darwin-amd64-32`).subscribe({
      next (value: any) {
        let versions = value.result.libraries[name];
        let keys: string[] = Object.keys(versions);
        let version: string = keys.reduce(function(preValue: string, curValue: string) {
          return preValue.toLowerCase > curValue.toLowerCase ? preValue : curValue;
        })
        const url: string = versions[version][0].url;
        addressObserver.next(url);
      },
      error: addressObserver.error
    });
  }
}
