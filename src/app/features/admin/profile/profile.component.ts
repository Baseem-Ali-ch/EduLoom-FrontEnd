import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../core/services/admin/profile.service';
import Swal from 'sweetalert2';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AdminSidebarComponent, EditModalComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any;
  instructor: any;
  isModalOpen: boolean = false;
  isInstructorModalOpen: boolean = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // display the user details
  loadUserData() {
    this.profileService.getUser().subscribe({
      next: (response: any) => {
        this.user = response.user;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      },
    });
  }

  // image file select
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      this.profileService.uploadProfilePhoto(formData).subscribe({
        next: (response) => {
          this.user.profilePhoto = response.photoUrl;
          Swal.fire({
            icon: 'success',
            title: response.message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgb(8, 10, 24)',
            color: 'white',
          });
        },
        error: (error) => {
          console.error('Error uploading photo:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error uploading photo',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgb(8, 10, 24)',
            color: 'white',
          });
        },
      });
    }
  }

  // get image url
  getImageUrl(photoUrl: string): string {
    return this.profileService.getFullImageUrl(photoUrl);
  }

  // open modal
  openEditModal() {
    this.isModalOpen = true;
  }

  // close modal
  closeModal() {
    this.isModalOpen = false;
  }

  // open instructor request modal
  openInstructorReqModal() {
    this.isInstructorModalOpen = true;
  }

  // close instructor request modal
  closeInstructorReqModal() {
    this.isInstructorModalOpen = false;
  }

  // update user details
  saveChanges(updatedData: any) {
    this.profileService.updateUser(updatedData).subscribe({
      next: (response: any) => {
        this.loadUserData();
        this.closeModal();
        if (response) {
          Swal.fire({
            icon: 'success',
            title: response.message || 'Profile updated successfully',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgb(8, 10, 24)',
            color: 'white',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: response.message || 'Error updating profile',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgb(8, 10, 24)',
            color: 'white',
          });
        }
      },
      error: (error: Error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error updating profile',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: 'rgb(8, 10, 24)',
          color: 'white',
        });
        console.error('Error updating user', error);
      },
    });
  }

}

