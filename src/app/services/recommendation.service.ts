import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  constructor(private authService: AuthService) { }
  getObjectRecommendation(obs: {next: (objectRecs: string[]) => void, error: (msg: string) => void}) {
    this.authService.getWithAuth('recommendation/objects', obs);
  }

  getLibraryRecommendation(obs: {next: (objectRecs: string[]) => void, error: (msg: string) => void}) {
    this.authService.getWithAuth('recommendation/libraries', obs);
  }
}
