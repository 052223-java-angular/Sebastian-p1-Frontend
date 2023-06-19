import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PdLibrary } from '../models/pd-library';
import { Observer } from 'rxjs';
import { PdObject } from '../models/pd-object';

@Injectable({
  providedIn: 'root'
})
export class LibraryServiceService {
  baseUrl='http://localhost:8080/puredatabase2/api/libraries'

  constructor(private http: HttpClient) { }

  getLibraries(libObserver: Observer<PdLibrary[]>): void {
    this.http.get<PdLibrary[]>(`${this.baseUrl}`).subscribe(libObserver);
  }

  getLibraryByName(name: string, libObserver: Observer<PdLibrary>): void {
    this.http.get<PdLibrary>(`${this.baseUrl}/${name}`).subscribe(libObserver);
  }

  getObjectByAddress(objName: string, libName: string, objObserver: Observer<PdObject>): void {
    this.http.get<PdObject>(`${this.baseUrl}/${libName}/${objName}`).subscribe(objObserver);
  }
}
