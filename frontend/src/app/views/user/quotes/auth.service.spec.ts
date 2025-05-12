import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from './quotes.module';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private apiUrl = 'http://127.0.0.1:8000/quotes/';
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getQuotes(page: number = 1, search?: string, category?: string): Observable<PaginatedResponse> {
    let params = new HttpParams().set('page', page.toString());
    
    // Ajouter les paramètres de recherche si présents
    if (search) {
      params = params.set('search', search);
    }
    
    if (category) {
      params = params.set('category', category);
    }

    // Obtention du token depuis le service d'authentification
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Retourner la requête avec tous les paramètres
    return this.http.get<PaginatedResponse>(this.apiUrl, { headers, params });
  }

  // Méthode pour créer une nouvelle citation
  createQuote(quote: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, quote, { headers });
  }
}