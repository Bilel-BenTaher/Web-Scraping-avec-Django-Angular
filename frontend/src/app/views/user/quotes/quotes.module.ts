import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotesRoutingModule } from './quotes-routing.module';
import { QuotesComponent } from './quotes/quotes.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    QuotesComponent
  ],
  imports: [
    QuotesRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
  ],
})
export class QuotesModule { }

export interface Quote {
  id: number;
  text: string;
  author: string;
  category?: string;  // Rendu optionnel car il semble ne pas exister dans votre modèle
  tags: string;  // Changé en string car c'est ainsi qu'il est stocké dans votre backend
  user?: number;
}

export interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Quote[];
}