import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/user/user.state';
import { ProfileService } from '../../../core/services/user/profile.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent implements OnInit{
  user: any;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private profileService: ProfileService
  ) {}

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

  // get image url
  getImageUrl(photoUrl: string): string {
    return this.profileService.getFullImageUrl(photoUrl);
  }

  // logout
  onLogout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/admin/login']);
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
}
