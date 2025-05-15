import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsletterService } from '../newsletter.service';


@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent {
  subscribeForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private newsletterService: NewsletterService
  ) {
    this.subscribeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.subscribeForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    // Arrêter si le formulaire est invalide
    if (this.subscribeForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.subscribeForm.value.email;

    this.newsletterService.subscribeToNewsletter(email).subscribe(
      response => {
        this.loading = false;
        this.successMessage = response.message || 'Inscription réussie!';
        this.subscribeForm.reset();
        this.submitted = false;
        
        // Masquer le message après 5 secondes
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error => {
        this.loading = false;
        this.errorMessage = error.error?.error || 'Une erreur s\'est produite. Veuillez réessayer.';
        
        // Masquer le message d'erreur après 5 secondes
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    );
  }
}