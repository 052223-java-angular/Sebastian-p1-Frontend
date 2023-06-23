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
    this.authService.deleteWithAuth(`like/library/${libName}`, obs);
  }
}
