import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { LogoutService } from '../../logout/logout.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,private http: HttpClient,private logoutService: LogoutService) { }

  ngOnInit(): void {this.authService.checkAuth();
    
   }

  onLogout(): void {
    this.logoutService.logout();
  }
  
}
