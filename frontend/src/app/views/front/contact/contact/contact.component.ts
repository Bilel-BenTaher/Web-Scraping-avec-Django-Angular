import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../contact.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]]
    });
  }

  get f() { return this.contactForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    // Stop if form is invalid
    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;
    
    const contactData = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      message: this.contactForm.value.message
    };

    this.contactService.sendContactMessage(contactData).subscribe(
      response => {
        this.loading = false;
        this.submitted = false;
        this.successMessage = 'Votre message a été envoyé avec succès!';
        this.contactForm.reset();
      },
      error => {
        this.loading = false;
        this.errorMessage = 'Une erreur s\'est produite lors de l\'envoi du message.';
        console.error('Error sending message:', error);
      }
    );
  }
}