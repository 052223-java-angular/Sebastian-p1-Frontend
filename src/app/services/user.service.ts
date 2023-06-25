import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User | null = null;
  baseUrl = environment.apiBaseUrl + '/user';
  profilePicUrl='http://localhost:8080/puredatabase2/api/profile_pics/';
  // in order to trigger re-load
  profilePicSuffix= '';
  constructor(private authService: AuthService, private http: HttpClient) { }

  newProfileSuffix() {
    this.profilePicSuffix = '?' + Math.random().toString(36).slice(2, 7);
  }

  getMe(obs: {next: (user: User) => void, error: (msg: string) => void}) {
    this.authService.getWithAuth("user/me", obs);
  }

  getUser(userId: string, obs: {next: (user: User) => void, error: (error: any) => void}) {
    this.http.get<User>(`${this.baseUrl}/user/${userId}`).subscribe(obs);
  }
}
