import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse, Quote } from './quotes.module';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private apiUrl = 'http://127.0.0.1:8000/quotes/';
  
  constructor(private http: HttpClient) { }

  // Méthode pour obtenir les headers d'authentification
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MTUzNjIwLCJpYXQiOjE3NDcxNTI3MjAsImp0aSI6IjU2YWY2ODE3ZDI1ZjRiOTk4ZWU1NWVjZjJlN2Q0MGUwIiwidXNlcl9pZCI6MTB9.eTxL_gj6vKKevkNkDV8_jhAYrXFoN2YJUnh7_pZ1MSI`
    });
  }

  getQuotes(page: number = 1, search?: string): Observable<PaginatedResponse> {
    // Créer les paramètres avec page
    let params = new HttpParams().set('page', page.toString());
    
    // Ajouter le paramètre de recherche s'il existe
    if (search && search.trim() !== '') {
      if (search.startsWith('#')) {
        // Si la recherche commence par #, on filtre par tag
        params = params.set('tags', search.substring(1));
      } else {
        // Sinon, on filtre par auteur
        params = params.set('author', search);
      }
    }
    
    // Faire la requête avec les paramètres et headers
    return this.http.get<PaginatedResponse>(this.apiUrl, { 
      headers: this.getAuthHeaders(),
      params: params 
    });
  }

  // Méthode pour obtenir une citation spécifique par ID
  getQuote(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  // Méthode pour mettre à jour une citation
  updateQuote(id: number, quoteData: Partial<Quote>): Observable<Quote> {
    return this.http.put<Quote>(`${this.apiUrl}update/${id}/`, quoteData, {
      headers: this.getAuthHeaders()
    });
  }

  // Méthode pour supprimer une citation
  deleteQuote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }
}