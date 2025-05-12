import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8000/quotes/create/'; // Ajustez l'URL selon votre configuration

  constructor(private http: HttpClient) { }

  // Méthode pour ajouter une nouvelle citation
  addQuote(quote: Quote): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Assurez-vous que le token est récupéré du stockage local
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MDgzMzc0LCJpYXQiOjE3NDcwODI0NzQsImp0aSI6ImY5MDFmZWVmYTVkMDQxMDI5ZWUzODIxYjNlNjQyNjNlIiwidXNlcl9pZCI6MTB9.afVSbplCDEoKqFqCVDWBGtYXND0YdDDVHkaj7Dxah9w`
      })
    };

    return this.http.post<Quote>(this.apiUrl, quote, httpOptions);
  }
}