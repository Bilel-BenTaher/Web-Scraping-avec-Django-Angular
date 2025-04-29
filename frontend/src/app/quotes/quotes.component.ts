import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
})
export class QuotesComponent implements OnInit {
  quotes: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getQuotes().subscribe((data: any) => {
      this.quotes = data;
    });
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}