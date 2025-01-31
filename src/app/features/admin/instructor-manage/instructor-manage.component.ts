import { Component, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../../core/services/admin/instructor.service';

@Component({
  selector: 'app-instructor-manage',
  standalone: true,
  imports: [AdminSidebarComponent, CommonModule],
  templateUrl: './instructor-manage.component.html',
  styleUrl: './instructor-manage.component.css',
})
export class InstructorManageComponent implements OnInit {
  allInstructors: any[] = [];

  constructor(private instructorService: InstructorService) {}

  ngOnInit(): void {
    this.getAllInstructor();
  }

  // fetch all user
  getAllInstructor() {
    this.instructorService.getInstructor().subscribe({
      next: (response) => {
        console.log(response);
        this.allInstructors = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateStatus(status: boolean) {}
}
