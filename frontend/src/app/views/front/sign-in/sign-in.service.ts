import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  private apiUrl = 'http://localhost:8000/signup/';  

  constructor(private http: HttpClient) { }

  // Méthode pour enregistrer un nouvel utilisateur
  signUp(userData: User): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }
}