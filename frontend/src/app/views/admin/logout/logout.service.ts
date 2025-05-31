import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private apiUrl = 'http://localhost:8000/signout/';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');

    if (!refreshToken || !accessToken) {
      this.cleanAndRedirect();
      return;
    }

    // Format correct de l'en-tête d'autorisation avec Bearer
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    this.http.post(
      this.apiUrl,
      { refresh: refreshToken },
      { headers }
    ).subscribe({
      next: (response) => {
        console.log('Déconnexion réussie:', response);
        this.cleanAndRedirect();
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
        // Même en cas d'erreur, on nettoie les données locales
        this.cleanAndRedirect();
      }
    });
  }

  private cleanAndRedirect(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}