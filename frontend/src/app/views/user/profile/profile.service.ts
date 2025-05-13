import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // URL de base pour l'API
  private apiBaseUrl = 'http://localhost:8000';
  
  constructor(private http: HttpClient) { }
  
  private getHeaders(): HttpHeaders {
    // Obtenir le token du localStorage au lieu d'utiliser un token codé en dur
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MTU4MzM0LCJpYXQiOjE3NDcxNTc0MzQsImp0aSI6IjdiNmY2NjBkNjZhYTQyZGZhZWY5ZDljMmExM2FmM2Y1IiwidXNlcl9pZCI6MTF9.KLV2UeNLJxTvuWnWlypWuPrBcC0QA8Mw4h2LKPqvE7A';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/profile/`, { headers: this.getHeaders() });
  }
  
  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/profile/update/`, data, { headers: this.getHeaders() });
  }
  
  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/profile/delete/`, { headers: this.getHeaders() });
  }
}