import { Component, OnDestroy, OnInit } from '@angular/core';
import { InstructorSidebarComponent } from '../../../shared/components/instructor-sidebar/instructor-sidebar.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CourseServiceService } from '../../../core/services/instructor/course.service.service';
import { ILesson, IModule } from '../../../core/models/Instructor';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InstructorSidebarComponent],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css',
})
export class AddCourseComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  totalSteps: number = 4;
  courseForm!: FormGroup;
  modules: IModule[] = [];
  currentModule: IModule = { title: '', lessons: [] };
  contents: { cont: any; lesson: string; module: string }[] = [];
  private _subscription: Subscription = new Subscription();

  constructor(private _fb: FormBuilder, private _courseService: CourseServiceService) {}

  ngOnInit(): void {
    this.form();
    this.addModule();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  form(): void {
    this.courseForm = this._fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      difficultyLevel: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      modules: this._fb.array([]),
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

  initializeModule() {
    this.currentModule = {
      title: '',
      lessons: [],
    };
    this.modules.push(this.currentModule);
  }

  get modulesArray(): FormArray {
    return this.courseForm.get('modules') as FormArray;
  }

  getLessonsArray(moduleIndex: number): FormArray {
    return this.modulesArray.at(moduleIndex).get('lessons') as FormArray;
  }

  // Module Methods
  addModule(): void {
    const moduleGroup = this._fb.group({
      title: ['', Validators.required],
      lessons: this._fb.array([]),
    });

    this.modulesArray.push(moduleGroup);
    // Add initial lesson to new module
    this.addLesson(this.modulesArray.length - 1);
  }

  deleteModule(moduleIndex: number): void {
    this.modulesArray.removeAt(moduleIndex);
  }

  // Lesson Methods
  addLesson(moduleIndex: number): void {
    const lessonGroup = this._fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });

    this.getLessonsArray(moduleIndex).push(lessonGroup);
  }

  deleteLesson(moduleIndex: number, lessonIndex: number): void {
    this.getLessonsArray(moduleIndex).removeAt(lessonIndex);
  }
  
  // Assignments
  getAssignmentsArray(): FormArray {
    return this.courseForm.get('assignments') as FormArray;
  }

  addAssignment(): void {
    const assignmentGroup = this._fb.group({
      assignmentTitle: ['', Validators.required],
      assignmentDescription: ['', Validators.required],
    });
    this.getAssignmentsArray().push(assignmentGroup);
  }

  deleteAssignment(index: number): void {
    this.getAssignmentsArray().removeAt(index);
  }

  // Quizzes
  getQuizzesArray(): FormArray {
    return this.courseForm.get('quizzes') as FormArray;
  }

  addQuiz(): void {
    const quizGroup = this._fb.group({
      title: ['', Validators.required],
      questions: this._fb.array([]),
    });
    this.getQuizzesArray().push(quizGroup);
  }

  deleteQuiz(index: number): void {
    this.getQuizzesArray().removeAt(index);
  }

  // Questions
  getQuestionsArray(quizIndex: number): FormArray {
    return this.getQuizzesArray().at(quizIndex).get('questions') as FormArray;
  }

  addQuestion(quizIndex: number): void {
    const questionGroup = this._fb.group({
      questionText: ['', Validators.required],
      options: this._fb.array([]),
    });
    this.getQuestionsArray(quizIndex).push(questionGroup);
  }

  deleteQuestion(quizIndex: number, questionIndex: number): void {
    this.getQuestionsArray(quizIndex).removeAt(questionIndex);
  }

  // Options
  getOptionsArray(quizIndex: number, questionIndex: number): FormArray {
    return this.getQuestionsArray(quizIndex).at(questionIndex).get('options') as FormArray;
  }

  addOption(quizIndex: number, questionIndex: number): void {
    const optionGroup = this._fb.group({
      optionText: ['', Validators.required],
      isCorrect: [false],
    });
    this.getOptionsArray(quizIndex, questionIndex).push(optionGroup);
  }

  deleteOption(quizIndex: number, questionIndex: number, optionIndex: number): void {
    this.getOptionsArray(quizIndex, questionIndex).removeAt(optionIndex);
  }

  // Live Classes
  getLiveClassesArray(): FormArray {
    return this.courseForm.get('liveClasses') as FormArray;
  }

  addLiveClass(): void {
    const liveClassGroup = this._fb.group({
      title: ['', Validators.required],
      scheduleDate: ['', Validators.required],
      duration: ['', Validators.required],
      meetingLink: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.getLiveClassesArray().push(liveClassGroup);
  }

  deleteLiveClass(index: number): void {
    this.getLiveClassesArray().removeAt(index);
  }

  onSubmit(): void {
    if (this.courseForm) {
      const courseData = this.courseForm.value;
      console.log('Submitting course data:', courseData);

      const subscription = this._courseService.createCourse(courseData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Course Created Successfully',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgb(8, 10, 24)',
            color: 'white',
          });
          this.courseForm.reset();
          this.currentStep = 1;
        },
        error: (error) => {
          console.error('Error creating course:', error);
          Swal.fire({
            icon: 'error',
            title: 'Course Creation Failed',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgb(8, 10, 24)',
            color: 'white',
          });
        },
      });

      this._subscription.add(subscription);
    } else {
      // this.courseForm.markAllAsTouched();
    }
  }
}
