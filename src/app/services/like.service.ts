import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(private authService: AuthService) {}
  hasUserLikedLibrary(libName: string, obs: {next: (value: boolean)=>void, error: (msg: string) => void}) {
    this.authService.getWithAuth(`like/library/${libName}`, obs);
  }

  addLibraryLike(libName: string, obs: {next: (value: boolean)=>void, error: (msg: string) => void}) {
    this.authService.postWithAuth(`like/library/${libName}`, null, obs);
  }

  deleteLibraryLike(libName: string, obs: {next: (value: boolean)=>void, error: (msg: string) => void}) {
    this.authService.deleteWithAuth(`like/library/object/${libName}`, obs);
  }

  hasUserLikedObject(libName: string, objName: string, obs: {next: (value: boolean)=>void, error: (msg: string) => void}) {
    this.authService.getWithAuth(`like/object/${libName}/${objName}`, obs);
  }                                     
                                        
  addObjectLike(libName: string, objName: string, obs: {next: (value: boolean)=>void, error: (msg: string) => void}) {
    this.authService.postWithAuth(`like/object/${libName}/${objName}`, null, obs);
  }                                     

  deleteObjectLike(libName: string, objName: string, obs: {next: (value: boolean)=>void, error: (msg: string) => void}) {
    this.authService.deleteWithAuth(`like/object/${libName}/${objName}`, obs);
  }
}
