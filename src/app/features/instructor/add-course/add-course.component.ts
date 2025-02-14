import { Component, OnInit } from '@angular/core';
import { InstructorSidebarComponent } from '../../../shared/components/instructor-sidebar/instructor-sidebar.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { select } from '@ngrx/store';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InstructorSidebarComponent],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css',
})
export class AddCourseComponent implements OnInit {
  currentStep: number = 1;
  totalSteps: number = 4;
  courseForm!: FormGroup;
  modules: string[] = [];
  lessons: { title: string; module: string }[] = [];
  contents: { cont: any; lesson: string; module: string }[] = [];

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.form();
    console.log('modules', this.modules);
    console.log('lessons', this.lessons);
    console.log('content', this.contents);
  }

  form(): void {
    this.courseForm = this._fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      difficultyLevel: ['', [Validators.required]],
      moduleTitle: ['', Validators.required],
      lessonTitle: ['', Validators.required],
      moduleSelection: [''],
      uploadContent: ['', Validators.required],
      lessonSelection: [''],
      price: ['', Validators.required],
    });
  }

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

  addModule(event: Event) {
    const moduleTitle = this.courseForm.get('moduleTitle')?.value;
    this.modules.push(moduleTitle);
    this.courseForm.get('moduleTitle')?.reset();
  }

  addLesson(event: Event) {
    const lessonTitle = this.courseForm.get('lessonTitle')?.value;
    const selectedModule = this.courseForm.get('moduleSelection')?.value;
    const lesson = {
      title: lessonTitle,
      module: selectedModule,
    };
    this.lessons.push(lesson);
    this.courseForm.get('lessonTitle')?.reset();
    this.courseForm.get('moduleSelection')?.reset();
  }

  addContent() {
    const content = this.courseForm.get('uploadContent')?.value;
    const selectedLesson = this.courseForm.get('lessonSelection')?.value; // This will be the entire lesson object

    // Access the title and module from the selected lesson object
    const lessonTitle = selectedLesson ? selectedLesson.title : '';
    const moduleTitle = selectedLesson ? selectedLesson.module : ''; // Assuming the lesson object has a module property

    console.log('selectedLesson', lessonTitle);
    console.log('les', lessonTitle, moduleTitle);

    const contentObj = {
      cont: content,
      lesson: lessonTitle,
      module: moduleTitle,
    };

    this.contents.push(contentObj);
    this.courseForm.get('uploadContent')?.reset();
    this.courseForm.get('lessonSelection')?.reset();
  }

  removeSection() {}
  removeContent() {}
  addAssignment() {}
  removeAssignment() {}
  addQuiz() {}
  removeQuiz() {}
  addLiveClass() {}
  removeLiveClass() {}
  onSubmit() {}
}
