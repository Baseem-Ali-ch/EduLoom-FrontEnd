import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/user/user.state';
import Swal from 'sweetalert2';
import { ProfileService } from '../../../core/services/instructor/profile.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-instructor-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './instructor-sidebar.component.html',
    styleUrl: './instructor-sidebar.component.css'
})

export class InstructorSidebarComponent implements OnInit, OnDestroy{
  instructor: any;
  private _subscription: Subscription = new Subscription()
  isSidebarOpen: boolean = false
  profilePhoto: string = ''

  constructor(
    private _router: Router,
    private _store: Store<AppState>,
    private _profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadInstructorData();
  }

  // display the user details
  loadInstructorData() {
    const loadInstructorDataSubscription = this._profileService.getInstructor().subscribe({
      next: (response: any) => {
        this.instructor = response.instructor;
        this.getImage();
      },
      error: (error) => {
        // console.error('Error loading user data:', error);
      },
    });
    this._subscription.add(loadInstructorDataSubscription)
  }

  getImage() {
    const getImageSubscription = this._profileService.getImage().subscribe({
      next: (response: any) => {
        this.profilePhoto = response.signedUrl;
      },
      error: (error) => {
        console.error('Error loading user image:', error);
      },
    });
    this._subscription.add(getImageSubscription);
  }

  // get image url
  getImageUrl(photoUrl: string): string {
    return this._profileService.getFullImageUrl(photoUrl);
  }

  // logout
  onLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    this._router.navigate(['/instructor/login']);
    if (!localStorage.getItem('isLoggedIn')) {
      Swal.fire({
        icon: 'success',
        title: 'Logout Successfull!',
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
        title: 'Logout Failed!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: 'rgb(8, 10, 24)',
        color: 'white',
      });
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
