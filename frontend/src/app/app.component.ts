import { Component } from '@angular/core';
import { AuthService } from './views/front/login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
   constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Vérifier l'authentification au démarrage de l'application
    this.authService.checkAuthentication();
  }
}
