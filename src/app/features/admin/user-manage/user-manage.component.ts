import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { UsersService } from '../../../core/services/admin/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-user-manage',
    standalone: true,
    imports: [AdminSidebarComponent, CommonModule, FormsModule],
    templateUrl: './user-manage.component.html',
    styleUrl: './user-manage.component.css'
})
export class UserManageComponent implements OnInit, OnDestroy {
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  displayedUsers: any[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  private _subscription: Subscription = new Subscription();

  constructor(private _userService: UsersService) {}

  ngOnInit(): void {
    this.getAllUser();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  // Fetch all users from the backend
  getAllUser() {
    const allUserSubscription = this._userService.getUser(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.allUsers = response.users;
        this.totalPages = response.totalPages;
        this.filterUsers(); // Apply filters after fetching users
      },
      error: (error) => {
        console.error(error);
      },
    });
    this._subscription.add(allUserSubscription);
  }

  // Filter users based on search term and status
  filterUsers() {
    this.filteredUsers = this.allUsers.filter((user) => {
      const matchesSearch = !this.searchTerm || user.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) || user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' || (this.selectedStatus === 'active' && user.isActive) || (this.selectedStatus === 'inactive' && !user.isActive);

      return matchesSearch && matchesStatus;
    });

    this.totalPages = Math.ceil(this.filteredUsers.length / this.limit); // Update total pages
    this.updateDisplayedUsers(); // Update displayed users for the current page
  }

  // Update displayed users for the current page
  updateDisplayedUsers() {
    const startIndex = (this.currentPage - 1) * this.limit;
    const endIndex = startIndex + this.limit;
    this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  // Navigate to a specific page
  goToPage(page: number) {
    console.log('page', page);

    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedUsers(); // Update displayed users for the new page
    }
  }

  // Update user status
  updateStatus(userId: string, status: boolean) {
    const updateStatusSubription = this._userService.updateUserStatus(userId, status).subscribe({
      next: (response) => {
        const user = this.allUsers.find((u) => u._id === userId);
        if (user) {
          user.isActive = status;
          this.filterUsers();
        }
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
    this._subscription.add(updateStatusSubription);
  }
}
