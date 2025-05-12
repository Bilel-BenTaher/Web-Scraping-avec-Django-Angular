import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/token/';
  private tokenKey = 'auth_token';
  private refreshKey = 'refresh_token';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.apiUrl, { username, password })
      .pipe(
        tap(tokens => {
          this.storeTokens(tokens);
        })
      );
  }

  private storeTokens(tokens: TokenResponse): void {
    localStorage.setItem(this.tokenKey, tokens.access);
    localStorage.setItem(this.refreshKey, tokens.refresh);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
  }
}