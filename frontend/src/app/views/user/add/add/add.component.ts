import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddService, Quote } from '../add.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  quoteForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private addService: AddService,
    private router: Router,
    private authService: AuthService
  ) {
    // Initialisation du formulaire
    this.quoteForm = this.formBuilder.group({
      text: ['', [Validators.required, Validators.minLength(5)]],
      author: ['', Validators.required],
      tags: ['']
    });
  }

  ngOnInit(): void {this.authService.checkAuth();}

  // Getters pour accéder facilement aux champs du formulaire
  get text() { return this.quoteForm.get('text'); }
  get author() { return this.quoteForm.get('author'); }
  get tags() { return this.quoteForm.get('tags'); }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    if (this.quoteForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const quoteData: Quote = {
      text: this.text?.value,
      author: this.author?.value,
      tags: this.tags?.value
    };

    this.addService.addQuote(quoteData).subscribe(
      response => {
        this.isSubmitting = false;
        this.successMessage = 'Quote added successfully!';
        this.quoteForm.reset();
        
        // Option: rediriger vers la liste des citations après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/quotes']);
        }, 2000);
      },
      error => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.detail || 'Failed to add quote. Please try again.';
        console.error('Error adding quote:', error);
      }
    );
  }

  // Méthode pour réinitialiser le formulaire
  resetForm() {
    this.quoteForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
}