import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any = {
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  };

  isEditing = false;
  deleteConfirm = '';
  showDeleteModal= false;

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        // Ensure all fields exist
        if (!this.profile.password) this.profile.password = '';
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        alert('Error loading profile');
      }
    });
  }

  saveProfile(): void {
    // Create an object containing only the modified fields
    const updateData: any = {};

    if (this.profile.email) updateData.email = this.profile.email;
    if (this.profile.first_name) updateData.first_name = this.profile.first_name;
    if (this.profile.last_name) updateData.last_name = this.profile.last_name;

    // Special handling for password
    if (this.profile.password && this.profile.password.trim() !== '') {
      updateData.password = this.profile.password;
    }

    this.profileService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.isEditing = false;

        // Reset the password field after update
        this.profile.password = '';

        alert('Profile successfully updated');

        // Reload the profile to get updated data
        this.loadProfile();

        // If the password was changed, suggest re-login
        if (updateData.password) {
          alert('Your password has been changed. Please log in again with your new password.');
          // Log out the user
          localStorage.removeItem('auth_token');
          // Redirect to login page
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Error during update:', err);
        alert('Error during update: ' + (err.error?.detail || 'Please check your information'));
      }
    });
  }

  openDeleteModal(event: Event): void {
    this.showDeleteModal = true;
    this.deleteConfirm = '';
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.deleteConfirm === 'DELETE') {
      this.profileService.deleteProfile().subscribe({
        next: () => {
          alert('Account successfully deleted');
          // Remove authentication token
          localStorage.removeItem('auth_token');
          // Redirect to login page
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error during deletion:', err);
          alert('Error deleting account: ' + (err.error?.detail || 'An error occurred'));
        }
      });
    } else {
      alert('Please type "DELETE" to confirm');
    }
  }
}
