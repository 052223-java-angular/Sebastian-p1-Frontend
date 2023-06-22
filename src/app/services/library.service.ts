import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PdLibrary } from '../models/pd-library';
import { Observer } from 'rxjs';
import { PdObject } from '../models/pd-object';
import { LibrarySummary } from '../models/library-summary';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  baseUrl='http://localhost:8080/puredatabase2/api/libraries'
  private recentLibrary: PdLibrary | null = null;
  constructor(private http: HttpClient) { }

  getLibraries(libObserver: Observer<LibrarySummary[]>): void {
    this.http.get<LibrarySummary[]>(`${this.baseUrl}`).subscribe(libObserver);
  }

  unsetRecent(): void {
    this.recentLibrary = null;
  }

  getRecent(): PdLibrary | null {
    return this.recentLibrary;
  }

  getLibraryByName(name: string, libObserver: Observer<PdLibrary>): void {
    if(name === this.recentLibrary?.name) {
      libObserver.next(this.recentLibrary);
      return;
    }
    this.http.get<PdLibrary>(`${this.baseUrl}/${name}`).subscribe({
      next: (lib: PdLibrary) => {
        this.recentLibrary = lib;
        libObserver.next(lib);
      },
      error: error => {
        libObserver.error(error.error.message);
      }
    });
  }

  getObjectByAddress(objName: string, libName: string, objObserver: Observer<PdObject>): void {
    if(libName === this.recentLibrary?.name) {
      let obj: PdObject | undefined = this.recentLibrary.objects.find(obj => obj.name === objName); 
      if(typeof(obj) !== "undefined") {
        objObserver.next(obj);
        return;
      }
    }
    this.http.get<PdObject>(`${this.baseUrl}/${libName}/${objName}`).subscribe(objObserver);
  }
}
