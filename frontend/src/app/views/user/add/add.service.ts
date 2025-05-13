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
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MTM5MTc1LCJpYXQiOjE3NDcxMzgyNzUsImp0aSI6IjlkMGU5ZWRhOTYzYjRmMWQ4MzU0MmI0MDJjN2Q3OTBkIiwidXNlcl9pZCI6MTB9.lh8OVyk5Bli2J_R6Xmg15VBaVxeSolU24DSERq-5zug`
      })
    };

    return this.http.post<Quote>(this.apiUrl, quote, httpOptions);
  }
}