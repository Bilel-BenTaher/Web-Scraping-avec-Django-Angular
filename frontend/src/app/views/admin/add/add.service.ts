import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../../front/login/login.service';

export interface Quote {
  text: string;
  author: string;
  tags: string;
  user?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AddService {
  private apiUrl = 'http://localhost:8000/quotes/create/';

  constructor(private http: HttpClient, private loginService: LoginService) { }

  // Méthode pour obtenir les headers avec le token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found in localStorage');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Méthode pour ajouter une nouvelle citation
  addQuote(quote: Quote): Observable<Quote> {
    return this.http.post<Quote>(this.apiUrl, quote, {
      headers: this.loginService.getAuthorizationHeader() 
    });
  }
}