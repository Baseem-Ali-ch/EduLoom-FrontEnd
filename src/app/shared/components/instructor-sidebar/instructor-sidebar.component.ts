import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/user/user.state';
import Swal from 'sweetalert2';
import { ProfileService } from '../../../core/services/instructor/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructor-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './instructor-sidebar.component.html',
  styleUrl: './instructor-sidebar.component.css'
})

export class InstructorSidebarComponent implements OnInit{
  instructor: any;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadInstructorData();
  }

  // display the user details
  loadInstructorData() {
    this.profileService.getInstructor().subscribe({
      next: (response: any) => {
        this.instructor = response.instructor;
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
    this.router.navigate(['/instructor/login']);
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
