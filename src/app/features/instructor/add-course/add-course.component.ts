import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CourseServiceService } from '../../../core/services/instructor/course.service.service';
import { InstructorSidebarComponent } from '../../../shared/components/instructor-sidebar/instructor-sidebar.component';
import { CouponService } from '../../../core/services/admin/coupon.service';
import { ICoupon, IOffer } from '../../../core/models/IAdmin';
import { OfferService } from '../../../core/services/admin/offer.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InstructorSidebarComponent],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'],
})
export class AddCourseComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  totalSteps: number = 4;
  courseForm!: FormGroup;
  coupons: ICoupon[] = [];
  offers: IOffer[] = [];
  private _subscription: Subscription = new Subscription();

  constructor(private _fb: FormBuilder, private _courseService: CourseServiceService, private _couponService: CouponService, private _offerService: OfferService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.addModule();
    this.getAllCoupon();
    this.getAllOffer();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
  get coursePreview() {
    return this.courseForm.value;
  }

  getAllCoupon() {
    const couponSubscription = this._couponService.getCoupons().subscribe({
      next: (response) => {
        this.coupons = response.result;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this._subscription.add(couponSubscription);
  }

  getAllOffer() {
    const offerSubscription = this._offerService.getOffers().subscribe({
      next: (response) => {
        this.offers = response.result;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this._subscription.add(offerSubscription);
  }

  initializeForm(): void {
    this.courseForm = this._fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      difficultyLevel: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      coupon: [''],
      offer: [''],
      modules: this._fb.array([]),
      assignments: this._fb.array([]),
      quizzes: this._fb.array([]),
      liveClasses: this._fb.array([]),
    });
  }

  // Stepper Navigation
  nextStep(): void {
    if (this.currentStep < this.totalSteps && this.isStepValid()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return (this.courseForm.get('title')?.valid && this.courseForm.get('description')?.valid && this.courseForm.get('category')?.valid && this.courseForm.get('difficultyLevel')?.valid) || false;
      case 2:
        return this.modulesArray.valid;
      case 3:
        // Optional validation for assignments, quizzes, liveClasses
        return true; // Adjust based on your requirements
      case 4:
        return this.courseForm.get('price')?.valid || false;
      default:
        return true;
    }
  }

  // Module Methods
  get modulesArray(): FormArray {
    return this.courseForm.get('modules') as FormArray;
  }

  getLessonsArray(moduleIndex: number): FormArray {
    return this.modulesArray.at(moduleIndex).get('lessons') as FormArray;
  }

  addModule(): void {
    const moduleGroup = this._fb.group({
      title: ['', Validators.required],
      lessons: this._fb.array([]),
    });
    this.modulesArray.push(moduleGroup);
    this.addLesson(this.modulesArray.length - 1); // Add initial lesson
  }

  deleteModule(moduleIndex: number): void {
    this.modulesArray.removeAt(moduleIndex);
  }

  // Lesson Methods
  addLesson(moduleIndex: number): void {
    const lessonGroup = this._fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      document: [''],
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
    });
    this.getLiveClassesArray().push(liveClassGroup);
  }

  deleteLiveClass(index: number): void {
    this.getLiveClassesArray().removeAt(index);
  }

  // Form Submission
  onFileChange(event: Event, moduleIndex: number, lessonIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const lessonControl = this.getLessonsArray(moduleIndex).at(lessonIndex);
      lessonControl.patchValue({ document: file }); // Store the File object
      console.log('Selected file:', file.name, file.size, file.type);
    }
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const courseData = this.courseForm.value;

      // Prepare FormData for files
      const filesFormData = new FormData();
      courseData?.modules.forEach((module: any) => {
        module?.lessons.forEach((lesson: any) => {
          if (lesson.document instanceof File) { // Check if it’s a File object
            filesFormData.append('documents', lesson.document); // Append File object
            console.log('Appending file:', lesson.document.name, lesson.document.size, lesson.document.type);
          }
        });
      });

      // Combine courseData and files into a single FormData
      const combinedFormData = new FormData();
      combinedFormData.append('courseData', JSON.stringify(courseData)); // Send courseData as JSON string
      for (let [key, value] of (filesFormData as any).entries()) {
        combinedFormData.append(key, value); // Append files
      }

      // Debug combined FormData
      console.log('Combined FormData:');
      for (let [key, value] of (combinedFormData as any).entries()) {
        console.log(`${key}:`, value);
      }

      const subscription = this._courseService.createCourse(combinedFormData).subscribe({
        next: (response) => {
          console.log('signed url', response.signedUrl)
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
          this.currentStep = 1;
          this.initializeForm();
          this.addModule();
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
      this.courseForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Please fill all required fields',
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
