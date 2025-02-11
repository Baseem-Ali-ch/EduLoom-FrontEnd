import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../../core/services/admin/instructor.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-instructor-manage',
  standalone: true,
  imports: [AdminSidebarComponent, CommonModule, FormsModule],
  templateUrl: './instructor-manage.component.html',
  styleUrl: './instructor-manage.component.css',
})
export class InstructorManageComponent implements OnInit, OnDestroy {
  allInstructors: any[] = [];
  filteredInstructors: any[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';
  private _subscription: Subscription = new Subscription();

  constructor(private _instructorService: InstructorService) {}

  // ng on init
  ngOnInit(): void {
    this.getAllInstructor();
  }

  // ng on destroy
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  // fetch all user
  getAllInstructor() {
    const instructorSubscription = this._instructorService.getInstructor().subscribe({
      next: (response) => {
        this.allInstructors = response;
        this.filteredInstructors = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this._subscription.add(instructorSubscription);
  }

  // update instructor status
  updateStatus(instructorId: string, status: boolean) {
    const updateStatusSubscription = this._instructorService.updateInstructorStatus(instructorId, status).subscribe({
      next: (response) => {
        const user = this.allInstructors.find((i) => i._id === instructorId);
        if (user) {
          user.isActive = status;
        }
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
    this._subscription.add(updateStatusSubscription);
  }

  // filter
  filterInstructor() {
    this.filteredInstructors = this.allInstructors.filter((instructor) => {
      const matchesSearch = !this.searchTerm || instructor.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) || instructor.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' || (this.selectedStatus === 'active' && instructor.isActive) || (this.selectedStatus === 'inactive' && !instructor.isActive);

      return matchesSearch && matchesStatus;
    });
  }

}
