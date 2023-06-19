import { Injectable } from '@angular/core';
import { TagService } from './tag.service';
import { Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LibraryTagService implements TagService {
  baseUrl='http://localhost:8080/puredatabase2/api/object_tags'
  constructor(private http: HttpClient) { }
  getTags(tagObserver: Observer<string[]>): void {
  }
  createTag(tagString: string,  tagObserver: Observer<void>): void {

  }
}
