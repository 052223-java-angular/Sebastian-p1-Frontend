import { Injectable } from '@angular/core';
import { TagService } from './tag.service';
import { HttpClient } from '@angular/common/http';
import { Observer } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ObjectTagService implements TagService {
  baseUrl='http://localhost:8080/puredatabase2/api/object_tags'
  constructor(private http: HttpClient, private authService: AuthService) { }
  getTags(tagObserver: Observer<string[]>): void {
    this.http.get<string[]>(this.baseUrl).subscribe(tagObserver);
  }
  createTag(tagString: string, tagObserver: Observer<void>): void {
    this.authService.postWithAuth<null>(`object_tags/${tagString}`, null, tagObserver);
  }
}
