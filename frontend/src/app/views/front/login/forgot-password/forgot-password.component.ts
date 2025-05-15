import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitted = false;
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const email = this.forgotPasswordForm.get('email')?.value;
    
    this.loginService.forgotPassword(email).subscribe({
      next: (response) => {
        this.isSubmitted = true;
        this.successMessage = `Un email de réinitialisation a été envoyé à ${email}`;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Une erreur s\'est produite lors de l\'envoi de l\'email';
        this.isLoading = false;
      }
    });
  }
}