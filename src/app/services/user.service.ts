import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User | null = null;
  profilePicUrl='http://localhost:8080/puredatabase2/api/profile_pics/'
  constructor(private authService: AuthService) { }

  getMe(obs: {next: (user: User) => void, error: (msg: string) => void}) {
    this.authService.getWithAuth("user/me", obs);
  }
}
