import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, AfterViewInit {

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

    // Password strength indicator (optionnel)
    const passwordField = document.querySelector('input[type="password"]');
    const progressBar = document.querySelector('.progress-bar');

    passwordField?.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      let strength = 0;

      if (value.length >= 8) strength += 25;
      if (/[A-Z]/.test(value)) strength += 25;
      if (/[0-9]/.test(value)) strength += 25;
      if (/[^A-Za-z0-9]/.test(value)) strength += 25;

      if (progressBar) {
        progressBar.setAttribute('style', `width: ${strength}%`);
        progressBar.classList.remove('bg-danger', 'bg-warning', 'bg-success');
        if (strength < 50) progressBar.classList.add('bg-danger');
        else if (strength < 75) progressBar.classList.add('bg-warning');
        else progressBar.classList.add('bg-success');
      }
    });
  }

}
