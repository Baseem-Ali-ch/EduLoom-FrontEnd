import { Component, } from '@angular/core';
import { InstructorSidebarComponent } from '../../../shared/components/instructor-sidebar/instructor-sidebar.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InstructorSidebarComponent],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css',
})
export class AddCourseComponent {
  currentStep: number = 1;
  totalSteps: number = 4; 

  courseForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    difficultyLevel: new FormControl('', [Validators.required]),
  });

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }
  

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  addSection() {}
  removeSection() {}
  addContent() {}
  removeContent() {}
  addAssignment() {}
  removeAssignment() {}
  addQuiz() {}
  removeQuiz() {}
  addLiveClass() {}
  removeLiveClass() {}
  
}
