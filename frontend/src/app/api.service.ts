import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getQuotes() {
    return this.http.get(`${this.apiUrl}/quotes/`);
  }
}