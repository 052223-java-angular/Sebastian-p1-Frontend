import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResults } from '../models/search-results';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  baseUrl= environment.apiBaseUrl + '/search/'
  constructor(private http: HttpClient) { }

  search(term: string, mode: string, obs: {next: (results: SearchResults)=> void, error: (error: any)=> void}) {
    const options = { params: new HttpParams().set('methods', mode) };
    this.http.get<SearchResults>(this.baseUrl + term, options).subscribe(obs);
  }
}
