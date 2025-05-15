import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = 'http://localhost:8000/api/newsletter/subscribe/';

  constructor(private http: HttpClient) { }

  subscribeToNewsletter(email: string): Observable<any> {
    return this.http.post(this.apiUrl, { email });
  }
}