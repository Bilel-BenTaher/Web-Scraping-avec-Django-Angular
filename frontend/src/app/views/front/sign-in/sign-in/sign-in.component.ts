import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignInService } from '../sign-in.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, AfterViewInit {
  signupForm: FormGroup;
  isSubmitting = false;
  errorMessages: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private signInService: SignInService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

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
    const passwordField = document.querySelector('input[name="password"]');
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

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessages = {};

    const userData = {
      first_name: this.signupForm.value.first_name,
      last_name: this.signupForm.value.last_name,
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    this.signInService.signUp(userData).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        this.isSubmitting = false;
        // Rediriger vers la page de connexion ou une page de confirmation
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription', error);
        this.isSubmitting = false;
        if (error.error) {
          this.errorMessages = error.error;
        }
      }
    });
  }
}