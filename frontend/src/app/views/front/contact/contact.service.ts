import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:8000/api/contact/send-email/';

  constructor(private http: HttpClient) { }

  sendContactMessage(contactData: any): Observable<any> {
    return this.http.post(this.apiUrl, contactData);
  }
}