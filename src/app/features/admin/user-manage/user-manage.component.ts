import { Component, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { UsersService } from '../../../core/services/admin/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [AdminSidebarComponent, CommonModule],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.css',
})
export class UserManageComponent implements OnInit {
  allUsers: any[] = [];

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getAllUser();
  }

  // fetch all user
  getAllUser() {
    this.userService.getUser().subscribe({
      next: (response) => {
        console.log(response);
        this.allUsers = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateStatus(status: boolean){

  }
}
