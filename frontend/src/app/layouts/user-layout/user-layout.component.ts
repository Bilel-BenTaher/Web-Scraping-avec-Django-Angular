import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {
  isTransparent = false;
  isMenuCollapsed = true;
  isUserDropdownOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', [])
  checkScroll(): void {
    this.isTransparent = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  toggleUserDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Ferme le dropdown lorsqu'on clique en dehors
    const target = event.target as HTMLElement;
    
    // Gestion du dropdown utilisateur
    if (this.isUserDropdownOpen) {
      if (!target.closest('#userDropdown') && !target.closest('.dropdown-menu')) {
        this.isUserDropdownOpen = false;
      }
    }
    
    // Fermeture du menu mobile en cliquant à l'extérieur
    if (!this.isMenuCollapsed && !target.closest('.navbar-collapse') && 
        !target.closest('.navbar-toggler')) {
      this.isMenuCollapsed = true;
    }
  }

  logout() {
    // Implémentez la déconnexion ici
    console.log('Déconnexion...');
    this.isUserDropdownOpen = false;
  }
}