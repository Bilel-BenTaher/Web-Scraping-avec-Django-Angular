import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse, Quote } from './quotes.module';
import { LoginService } from '../../front/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private apiUrl = 'http://127.0.0.1:8000/quotes/';
  private apiscr = 'http://127.0.0.1:8000';
  
  constructor(private http: HttpClient,private loginService: LoginService) { }

  // Méthode pour obtenir les headers d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getQuotes(page: number = 1, search?: string): Observable<PaginatedResponse> {
    let params = new HttpParams().set('page', page.toString());
    
    if (search && search.trim() !== '') {
      if (search.startsWith('#')) {
        params = params.set('tags', search.substring(1));
      } else {
        params = params.set('author', search);
      }
    }
    
    return this.http.get<PaginatedResponse>(this.apiUrl, { 
      headers: this.loginService.getAuthorizationHeader() ,
      params: params 
    });
  }

  getQuote(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}${id}/`, {
      headers: this.loginService.getAuthorizationHeader() 
    });
  }

  updateQuote(id: number, quoteData: Partial<Quote>): Observable<Quote> {
    return this.http.put<Quote>(`${this.apiUrl}update/${id}/`, quoteData, {
      headers: this.loginService.getAuthorizationHeader() 
    });
  }

  deleteQuote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${id}/`, {
      headers: this.loginService.getAuthorizationHeader() 
    });
  }

  // Nouvelle méthode pour gérer les erreurs de token
  private handleTokenError(error: any): void {
    if (error.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('access_token');
      // Vous pourriez aussi rediriger vers la page de login ici
      console.error('Session expired, please login again');
    }
    throw error;
  }

    // Méthode pour déclencher le scraping
  triggerScraping(): Observable<any> {
    return this.http.post(`${this.apiscr}/api/trigger-scraping/`, {});
  }
}
