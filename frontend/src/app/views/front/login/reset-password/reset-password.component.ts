import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  showPassword = false;
  showConfirmPassword = false;
  isSubmitted = false;
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.matchPasswords
    });
  }

  ngOnInit(): void {
    // Récupérer le token depuis l'URL
    this.route.params.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.errorMessage = 'Token invalide';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      }
    });
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  matchPasswords(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const { password, confirmPassword } = this.resetPasswordForm.value;
    
    this.loginService.resetPassword(this.token, password, confirmPassword).subscribe({
      next: (response) => {
        this.isSubmitted = true;
        this.successMessage = 'Votre mot de passe a été réinitialisé avec succès';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Une erreur s\'est produite lors de la réinitialisation du mot de passe';
        this.isLoading = false;
      }
    });
  }
}