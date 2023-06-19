import { Injectable } from '@angular/core';
import { Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class TagService {
  abstract getTags(tagObserver: Observer<string[]>): void;
  abstract createTag(tagName: string, tagObserver: Observer<void>): void;
}
