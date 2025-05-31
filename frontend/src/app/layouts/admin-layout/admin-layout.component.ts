import { Component, HostListener, OnInit } from '@angular/core';
import { LogoutService } from 'src/app/views/admin/logout/logout.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
    template: `
    <button (click)="onLogout()">Déconnexion</button>
  `
})
export class AdminLayoutComponent implements OnInit {

 isTransparent = false;
   isMenuCollapsed = true;
   isUserDropdownOpen = false;
 
   constructor(private logoutService: LogoutService) { }
 
   ngOnInit(): void {}
 
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
   
    onLogout(): void {
     this.logoutService.logout();
   }
 
 }
