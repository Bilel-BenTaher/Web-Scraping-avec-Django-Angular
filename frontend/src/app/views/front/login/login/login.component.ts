import { Component, OnInit ,AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    // Toggle password visibility
    const toggleBtn = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('input[type="password"]');

    toggleBtn?.addEventListener('click', () => {
      const type = passwordInput?.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput?.setAttribute('type', type);
      toggleBtn.innerHTML = type === 'password' 
        ? '<i class="fas fa-eye"></i>' 
        : '<i class="fas fa-eye-slash"></i>';
    });
  }

}
