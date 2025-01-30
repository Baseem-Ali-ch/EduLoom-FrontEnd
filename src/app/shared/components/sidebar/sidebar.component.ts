import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { AppState } from '../../../state/user/user.state';
import { selectUser } from '../../../state/user/user.selector';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/IUser';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
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
    this.router.navigate(['/user/login']);
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
