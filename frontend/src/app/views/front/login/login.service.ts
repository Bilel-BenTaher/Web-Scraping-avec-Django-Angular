import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LogoutService } from '../../user/logout/logout.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private tokenRefreshTimerId: any;
  private readonly API_URL = 'http://localhost:8000';

  constructor(
    private http: HttpClient,
    private router: Router,
    private logoutService: LogoutService
  ) {
    // Au démarrage du service, vérifier si on doit rafraîchir le token
    if (this.isLoggedIn()) {
      this.startTokenRefresh();
    }
  }

  // Méthode de connexion
  login(email: string, password: string): void {
    this.http.post(`${this.API_URL}/signin/`, { email, password })
      .subscribe({
        next: (response: any) => {
          this.saveAuthData(response);
          this.startTokenRefresh(); // Démarrer le rafraîchissement après connexion
          this.router.navigate(['/user/home']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          alert('Email ou mot de passe incorrect');
        }
      });
  }

  // Méthode pour mot de passe oublié
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot_password/`, { email });
  }

  // Méthode pour réinitialiser le mot de passe
  resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset_password/${token}/`, {
      password,
      confirmPassword
    });
  }

  // Sauvegarde les données d'authentification
  private saveAuthData(authData: any): void {
    localStorage.setItem('access_token', authData.tokens.access);
    localStorage.setItem('refresh_token', authData.tokens.refresh);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Récupère le token d'accès actuel
  getAccessToken(): string {
    return localStorage.getItem('access_token') || '';
  }

  // Délègue complètement la déconnexion au LogoutService
  logout(): void {
    this.stopTokenRefresh(); // Arrêter le rafraîchissement avant déconnexion
    this.logoutService.logout();
  }

  // Rafraîchit le token
  refreshToken(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      this.logoutService.logout();
      return;
    }
    
    this.http.post(`${this.API_URL}/token/refresh/`, { refresh: refreshToken })
      .subscribe({
        next: (response: any) => {
          console.log('Token rafraîchi avec succès');
          
          // Stocker le nouveau token d'accès
          localStorage.setItem('access_token', response.access);
          
          // Si un nouveau refresh token est fourni, le stocker aussi
          if (response.refresh) {
            localStorage.setItem('refresh_token', response.refresh);
          }
        },
        error: (error) => {
          console.error('Refresh token failed:', error);
          this.logoutService.logout();
        }
      });
  }

  // Démarre le processus de rafraîchissement automatique du token
  private startTokenRefresh(): void {
    // Arrêter le timer existant s'il y en a un
    this.stopTokenRefresh();
    
    // Rafraîchir le token immédiatement
    this.refreshToken();
    
    // Programmer le rafraîchissement périodique (toutes les 10 minutes au lieu de 12)
    this.tokenRefreshTimerId = setInterval(() => {
      this.refreshToken();
    }, 10 * 60 * 1000); // 10 minutes
  }

  // Arrête le processus de rafraîchissement du token
  private stopTokenRefresh(): void {
    if (this.tokenRefreshTimerId) {
      clearInterval(this.tokenRefreshTimerId);
      this.tokenRefreshTimerId = null;
    }
  }
  
  // Cette méthode permet d'obtenir facilement un token valide pour les requêtes HTTP
  // À utiliser dans chaque service qui a besoin de faire des requêtes authentifiées
  getAuthorizationHeader(): { Authorization: string } {
    return {
      Authorization: `Bearer ${this.getAccessToken()}`
    };
  }
}