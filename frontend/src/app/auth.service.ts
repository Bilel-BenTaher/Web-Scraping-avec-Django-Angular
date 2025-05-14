import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  // Vérifie si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Redirige vers la page de login si non connecté
  checkAuth(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }
}