import { Injectable } from '@angular/core';
import { TagService } from './tag.service';
import { HttpClient } from '@angular/common/http';
import { Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectTagService implements TagService {
  baseUrl='http://localhost:8080/puredatabase2/api/object_tags'
  constructor(private http: HttpClient) { }
  getTags(tagObserver: Observer<string[]>): void {
  }
  createTag(tagString: string,  tagObserver: Observer<void>): void {

  }
}
