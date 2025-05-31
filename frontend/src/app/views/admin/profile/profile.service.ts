import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../../front/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiBaseUrl = 'http://localhost:8000';
  
  constructor(private http: HttpClient, private loginService: LoginService) { }
  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Aucun token trouvé - Veuillez vous reconnecter');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/profile/`, { 
     headers: this.loginService.getAuthorizationHeader() 
    });
  }
  
  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/profile/update/`, profileData, { 
      headers: this.loginService.getAuthorizationHeader() 
    });
  }
  
  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/profile/delete/`, { 
      headers: this.loginService.getAuthorizationHeader() 
    });
  }
}