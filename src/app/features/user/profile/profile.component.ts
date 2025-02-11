import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../../core/services/user/auth.service';
import { CommonModule } from '@angular/common';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import Swal from 'sweetalert2';
import { InstructorReqComponent } from './instructor-req/instructor-req.component';
import { ProfileService } from '../../../core/services/user/profile.service';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SidebarComponent, CommonModule, EditModalComponent, InstructorReqComponent, ChangePasswordModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: any;
  instructor: any;
  isModalOpen: boolean = false;
  isInstructorModalOpen: boolean = false;
  isChangePasswordModalOpen: boolean = false;
  private _subscription: Subscription = new Subscription();

  constructor(private _profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // display the user details
  loadUserData() {
    const loadUserSubscription = this._profileService.getUser().subscribe({
      next: (response: any) => {
        this.user = response.user;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      },
    });
    this._subscription.add(loadUserSubscription);
  }

  // image file select
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const fileUploadSubscription = this._profileService.uploadProfilePhoto(formData).subscribe({
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
      this._subscription.add(fileUploadSubscription);
    }
  }

  // get image url
  getImageUrl(photoUrl: string): string {
    return this._profileService.getFullImageUrl(photoUrl);
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

  // change password modal
  changePassword() {
    this.isChangePasswordModalOpen = true;
  }

  // close change password modal
  closeChangePassword() {
    this.isChangePasswordModalOpen = false;
  }

  // save new password
  savePassword(passwordData: any) {
    const changePasswordSubscription = this._profileService.changePassword(passwordData).subscribe({
      next: (response: any) => {
        this.closeChangePassword();
        if (response) {
          Swal.fire({
            icon: 'success',
            title: response.message || 'Password changed successfully',
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
            title: response.message || 'Error change password',
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
    });
    this._subscription.add(changePasswordSubscription);
  }

  // update user details
  saveChanges(updatedData: any) {
    const saveChangesSubscription = this._profileService.updateUser(updatedData).subscribe({
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
    this._subscription.add(saveChangesSubscription);
  }

  // send instructor details to admin
  sendInstructorDetails(instructorDetails: any) {
    const sendInstructorDetailsSubscription = this._profileService.becomeInstructor(instructorDetails, this.user._id).subscribe({
      next: (response: any) => {
        this.closeInstructorReqModal();
        if (response) {
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
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to send request',
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
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: error.error?.message || 'Faile to send request',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: 'rgb(8, 10, 24)',
          color: 'white',
        });
        console.error('Faile to send request', error);
      },
    });
    this._subscription.add(sendInstructorDetailsSubscription);
  }
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
