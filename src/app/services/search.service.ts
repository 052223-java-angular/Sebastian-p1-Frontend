import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResults } from '../models/search-results';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  baseUrl='http://localhost:8080/puredatabase2/api/search/'
  constructor(private http: HttpClient) { }

  search(term: string, mode: string, obs: {next: (results: SearchResults)=> void, error: (error: any)=> void}) {
    const options = { params: new HttpParams().set('methods', mode) };
    this.http.get<SearchResults>(this.baseUrl + term, options).subscribe(obs);
  }
}
