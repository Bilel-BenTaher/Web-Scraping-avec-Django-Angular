import { Component, OnInit } from '@angular/core';
import { QuotesService } from '../quotes.service';
import { Quote, PaginatedResponse } from '../quotes.module';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  quotes: Quote[] = [];
  
  currentPage = 1;
  totalPages = 1;
  totalQuotes = 0;
  pageSize = 5; // Correspond à la valeur PAGE_SIZE dans votre backend Django
  searchQuery = '';
  isLoading = false;
  searchPlaceholder = 'Search by author (e.g. john) or tag (e.g. #react)';
  scrapingMessage = '';

  // Variables pour l'édition
  editingQuote: Quote | null = null;
  isEditing = false;
  
  constructor(private quoteService: QuotesService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadQuotes();
    this.authService.checkAuth();
  }

  loadQuotes(): void {
    this.isLoading = true;
    this.quoteService.getQuotes(this.currentPage, this.searchQuery).subscribe({
      next: (response: PaginatedResponse) => {
        this.quotes = response.results;
        this.totalQuotes = response.count;
        this.totalPages = Math.ceil(this.totalQuotes / this.pageSize);
        
        console.log('Quotes loaded:', this.quotes);
        console.log('Total pages:', this.totalPages);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading quotes:', error);
        this.isLoading = false;
      }
    });
  }

  triggerScraping(): void {
    this.isLoading = true;
    this.scrapingMessage = 'Starting scraping process...';
    
    this.quoteService.triggerScraping().subscribe({
      next: (response) => {
        this.scrapingMessage = 'Scraping running in background. Please wait...';
        this.isLoading = false;
        
        // After a delay, reload the quotes
        setTimeout(() => {
          this.loadQuotes();
          this.scrapingMessage = 'Scraping completed. Quotes have been updated.';
        }, 5000); // 5-second delay - adjust as needed
      },
      error: (error) => {
        this.scrapingMessage = 'Error while starting the scraping process.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1; // Revenir à la première page lors d'une recherche
    this.loadQuotes();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return; // Ne rien faire si la page demandée est invalide ou la même
    }
    
    this.currentPage = page;
    this.loadQuotes();
    
    // Faire défiler vers le haut de la page après changement
    window.scrollTo(0, 0);
  }
  
  // Méthode pour transformer la chaîne de tags en tableau
  getTagsArray(tagsString: string): string[] {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim());
  }
  
  // Méthode pour filtrer sur un tag spécifique
  filterByTag(tag: string): void {
    this.searchQuery = '#' + tag.trim();
    this.onSearch();
  }
  
  // Générer un tableau des pages à afficher pour la pagination
  get pages(): number[] {
    const totalVisible = 5; // Nombre de boutons de page visibles
    const pages: number[] = [];
    
    if (this.totalPages <= totalVisible) {
      // Afficher toutes les pages si leur nombre est inférieur au nombre visible
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calcul pour afficher les pages autour de la page courante
      let start = Math.max(1, this.currentPage - Math.floor(totalVisible / 2));
      let end = start + totalVisible - 1;
      
      if (end > this.totalPages) {
        end = this.totalPages;
        start = Math.max(1, end - totalVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
  
}