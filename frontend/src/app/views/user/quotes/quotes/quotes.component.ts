import { Component, OnInit } from '@angular/core';
import { QuotesService } from '../quotes.service';
import { Quote, PaginatedResponse } from '../quotes.module';

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

  // Variables pour l'édition
  editingQuote: Quote | null = null;
  isEditing = false;
  
  constructor(private quoteService: QuotesService) { }

  ngOnInit(): void {
    this.loadQuotes();
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

  // NOUVELLES MÉTHODES POUR ÉDITION ET SUPPRESSION

  // Ouvrir le mode d'édition pour une citation
  editQuote(quote: Quote): void {
    // Créer une copie pour ne pas modifier directement l'objet dans la liste
    this.editingQuote = { ...quote };
    this.isEditing = true;
  }

  // Annuler l'édition
  cancelEdit(): void {
    this.editingQuote = null;
    this.isEditing = false;
  }

  // Sauvegarder les modifications
  saveQuote(): void {
    if (!this.editingQuote) return;
    
    this.isLoading = true;
    this.quoteService.updateQuote(this.editingQuote.id, this.editingQuote).subscribe({
      next: (updatedQuote) => {
        // Mettre à jour la citation dans le tableau local
        const index = this.quotes.findIndex(q => q.id === updatedQuote.id);
        if (index !== -1) {
          this.quotes[index] = updatedQuote;
        }
        
        this.isLoading = false;
        this.isEditing = false;
        this.editingQuote = null;
      },
      error: (error) => {
        console.error('Error updating quote:', error);
        this.isLoading = false;
        // Vous pouvez ajouter un message d'erreur ici
      }
    });
  }

  // Supprimer une citation
  deleteQuote(quote: Quote): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la citation de ${quote.author} ?`)) {
      this.isLoading = true;
      this.quoteService.deleteQuote(quote.id).subscribe({
        next: () => {
          // Supprimer la citation du tableau local
          this.quotes = this.quotes.filter(q => q.id !== quote.id);
          this.totalQuotes--;
          
          // Recalculer le nombre total de pages
          this.totalPages = Math.ceil(this.totalQuotes / this.pageSize);
          
          // Si la page actuelle n'existe plus, revenir à la dernière page
          if (this.currentPage > this.totalPages && this.totalPages > 0) {
            this.currentPage = this.totalPages;
            this.loadQuotes();
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting quote:', error);
          this.isLoading = false;
          // Vous pouvez ajouter un message d'erreur ici
        }
      });
    }
  }
}