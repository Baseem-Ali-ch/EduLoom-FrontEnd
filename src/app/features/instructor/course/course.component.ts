import { Component } from '@angular/core';
import { InstructorSidebarComponent } from '../../../shared/components/instructor-sidebar/instructor-sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-course',
    standalone: true,
    imports: [InstructorSidebarComponent, RouterModule],
    templateUrl: './course.component.html',
    styleUrl: './course.component.css'
})
export class CourseComponent {

}
