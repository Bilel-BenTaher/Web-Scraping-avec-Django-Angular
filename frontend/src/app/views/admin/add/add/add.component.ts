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
  fieldErrors: any = {}; // To store field-specific errors

  constructor(
    private formBuilder: FormBuilder,
    private addService: AddService,
    private router: Router,
    private authService: AuthService
  ) {
    // Form initialization
    this.quoteForm = this.formBuilder.group({
      text: ['', [Validators.required, Validators.minLength(5)]],
      author: [''],
      tags: ['']
    });
  }

  ngOnInit(): void {
    this.authService.checkAuth();
  }

  // Getters to easily access form fields
  get text() { return this.quoteForm.get('text'); }
  get author() { return this.quoteForm.get('author'); }
  get tags() { return this.quoteForm.get('tags'); }

  // Method called on form submission
  onSubmit() {
    if (this.quoteForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.fieldErrors = {}; // Reset field errors

    const quoteData: Quote = {
      text: this.text?.value,
      author: this.author?.value,
      tags: this.tags?.value
    };

    this.addService.addQuote(quoteData).subscribe(
      response => {
        this.isSubmitting = false;
        this.successMessage = 'Quote successfully added!';
        this.quoteForm.reset();
        
        // Optional: redirect to the quote list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/quotes']);
        }, 2000);
      },
      error => {
        this.isSubmitting = false;
        console.error('Error adding quote:', error);
        
        // Handle backend validation errors
        if (error.status === 400 && error.error) {
          // If the error contains field-level validation details
          if (typeof error.error === 'object') {
            this.fieldErrors = error.error;
            
            // Build a global error message
            let errorMessages = [];
            for (const field in error.error) {
              if (error.error[field]) {
                if (Array.isArray(error.error[field])) {
                  errorMessages.push(...error.error[field]);
                } else {
                  errorMessages.push(error.error[field]);
                }
              }
            }
            this.errorMessage = errorMessages.join(' ');
          } else {
            this.errorMessage = error.error.detail || 'Error while adding the quote.';
          }
        } else {
          this.errorMessage = 'Error while adding the quote. Please try again.';
        }
      }
    );
  }

  // Method to reset the form
  resetForm() {
    this.quoteForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.fieldErrors = {};
  }

  // Helper method to check if a field has a specific error
  hasFieldError(fieldName: string): boolean {
    return this.fieldErrors && this.fieldErrors[fieldName];
  }

  // Helper method to get the error message of a specific field
  getFieldError(fieldName: string): string {
    if (this.fieldErrors && this.fieldErrors[fieldName]) {
      if (Array.isArray(this.fieldErrors[fieldName])) {
        return this.fieldErrors[fieldName][0];
      }
      return this.fieldErrors[fieldName];
    }
    return '';
  }
}
