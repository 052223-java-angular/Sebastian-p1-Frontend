import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  baseUrl = environment.apiBaseUrl + '/like';

  constructor(private authService: AuthService, private http: HttpClient) {}

  getAllLikes(obs: {next: (value: {type: string, value:string}[]) => void, error: (msg: string) => void}):
    void {
    this.authService.getWithAuth("like", obs);
  }

  getUserLikes(userId: String, obs: {next: (value: any) => void,
    error: (error: any) => void}) {
      this.http.get<{type: String, value: string}[]>(`${this.baseUrl}/user/${userId}`).subscribe(obs);
  }

  hasUserLikedLibrary(libName: string, obs: {next: (value: boolean)=>void, error: (msg: string) => void}) {
    this.authService.getWithAuth(`like/library/${libName}`, obs);
  }

  addLibraryLike(libName: string, obs: {next: (value: boolean)=>void, error: (msg: string) => void}) {
    this.authService.postWithAuth(`like/library/${libName}`, null, obs);
  }

  deleteLibraryLike(libName: string, obs: {next: (value: boolean)=>void, error: (msg: string) => void}) {
    this.authService.deleteWithAuth(`like/library/${libName}`, obs);
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
