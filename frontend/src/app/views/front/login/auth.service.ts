// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8000';
  private tokenRefreshTimer: any;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Vérifier l'authentification au démarrage
    this.checkAuthOnInit();
  }

  // Vérification initiale de l'authentification
  private checkAuthOnInit(): void {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!accessToken || !refreshToken) {
      // Ne rediriger que si on n'est pas déjà sur la page d'accueil
      if (!this.router.url.includes('/home') && this.router.url !== '/') {
        this.redirectToHome();
      }
      return;
    }

    // Vérifier la validité du token avec le backend
    this.verifyTokenWithBackend();
  }

  // Vérification du token avec le backend
  private verifyTokenWithBackend(): void {
    const token = localStorage.getItem('access_token');
    
    this.http.post(`${this.API_URL}/verify-token/`, { token })
      .subscribe({
        next: () => {
          // Token valide
          this.isAuthenticatedSubject.next(true);
          this.startTokenRefresh();
          // NE PAS rediriger automatiquement - rester sur la page actuelle
          this.handleSuccessfulAuth();
        },
        error: (error) => {
          // Token invalide, essayer de le rafraîchir
          if (error.status === 401) {
            this.attemptTokenRefresh();
          } else {
            this.handleAuthFailure();
          }
        }
      });
  }

  // Tentative de rafraîchissement du token
  private attemptTokenRefresh(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      this.handleAuthFailure();
      return;
    }

    this.http.post(`${this.API_URL}/token/refresh/`, { refresh: refreshToken })
      .subscribe({
        next: (response: any) => {
          // Sauvegarder le nouveau token
          localStorage.setItem('access_token', response.access);
          if (response.refresh) {
            localStorage.setItem('refresh_token', response.refresh);
          }
          
          this.isAuthenticatedSubject.next(true);
          this.startTokenRefresh();
          // NE PAS rediriger automatiquement - rester sur la page actuelle
          this.handleSuccessfulAuth();
        },
        error: () => {
          this.handleAuthFailure();
        }
      });
  }

  // Gestion de l'authentification réussie
  private handleSuccessfulAuth(): void {
    const currentUrl = this.router.url;
    
    // Rediriger uniquement si on est sur la page d'accueil ou racine
    if (currentUrl === '/' || currentUrl === '/home' || currentUrl === '') {
      this.redirectToCorrectHome();
    }
    // Sinon, rester sur la page actuelle
  }

 // Connexion utilisateur
  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.API_URL}/signin/`, { email, password })
        .subscribe({
          next: (response: any) => {
            this.saveAuthData(response, email);
            this.isAuthenticatedSubject.next(true);
            this.startTokenRefresh();
            
            // Redirection simple basée sur l'email
            if (email === 'bilelbentaher9@gmail.com') {
              this.router.navigate(['/admin/home']);
            } else {
              this.router.navigate(['/user/home']);
            }
            
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          }
        });
    });
  }

  // Déconnexion
  logout(): void {
    this.stopTokenRefresh();
    this.clearAuthData();
    this.isAuthenticatedSubject.next(false);
    this.redirectToHome();
  }

  // Sauvegarder les données d'authentification
  private saveAuthData(authData: any, email?: string): void {
    localStorage.setItem('access_token', authData.tokens.access);
    localStorage.setItem('refresh_token', authData.tokens.refresh);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    // Sauvegarder l'email pour pouvoir déterminer le rôle plus tard
    if (email) {
      localStorage.setItem('user_email', email);
    } else if (authData.user && authData.user.email) {
      localStorage.setItem('user_email', authData.user.email);
    }
  }

  // Effacer les données d'authentification
  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_email');
  }

  // Démarrer le rafraîchissement automatique
  private startTokenRefresh(): void {
    this.stopTokenRefresh();
    
    // Rafraîchir toutes les 10 minutes
    this.tokenRefreshTimer = setInterval(() => {
      this.refreshTokenSilently();
    }, 10 * 60 * 1000);
  }

  // Arrêter le rafraîchissement automatique
  private stopTokenRefresh(): void {
    if (this.tokenRefreshTimer) {
      clearInterval(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  // Rafraîchissement silencieux du token
  private refreshTokenSilently(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      this.handleAuthFailure();
      return;
    }

    this.http.post(`${this.API_URL}/token/refresh/`, { refresh: refreshToken })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('access_token', response.access);
          if (response.refresh) {
            localStorage.setItem('refresh_token', response.refresh);
          }
        },
        error: () => {
          this.handleAuthFailure();
        }
      });
  }

  // Gestion de l'échec d'authentification
  private handleAuthFailure(): void {
    this.clearAuthData();
    this.isAuthenticatedSubject.next(false);
    this.redirectToHome();
  }

  // Redirection vers la page d'accueil
  private redirectToHome(): void {
    this.router.navigate(['/home']);
  }

  // Redirection vers l'espace utilisateur approprié
  private redirectToCorrectHome(): void {
    const userEmail = this.getUserEmail();
    
    if (userEmail === 'bilelbentaher9@gmail.com') {
      this.router.navigate(['/admin/home']);
    } else {
      this.router.navigate(['/user/home']);
    }
  }

  // Obtenir l'email de l'utilisateur connecté
  private getUserEmail(): string | null {
    // Essayer d'abord depuis localStorage
    let email = localStorage.getItem('user_email');
    
    // Si pas trouvé, essayer depuis l'objet user
    if (!email) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          email = user.email;
          // Sauvegarder pour la prochaine fois
          if (email) {
            localStorage.setItem('user_email', email);
          }
        } catch (e) {
          console.error('Erreur lors du parsing des données utilisateur:', e);
        }
      }
    }
    
    return email;
  }

  // Obtenir le token d'accès
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    const userEmail = this.getUserEmail();
    return userEmail === 'bilelbentaher9@gmail.com';
  }

  // Obtenir les en-têtes d'autorisation
  getAuthHeaders(): { Authorization: string } | {} {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Méthode publique pour vérifier l'authentification
  checkAuthentication(): void {
    this.checkAuthOnInit();
  }
}