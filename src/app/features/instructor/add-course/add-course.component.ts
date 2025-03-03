import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CourseServiceService } from '../../../core/services/instructor/course.service.service';
import { InstructorSidebarComponent } from '../../../shared/components/instructor-sidebar/instructor-sidebar.component';
import { CouponService } from '../../../core/services/admin/coupon.service';
import { OfferService } from '../../../core/services/admin/offer.service';
import { ICoupon, IOffer } from '../../../core/models/IAdmin';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InstructorSidebarComponent],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'],
})
export class AddCourseComponent implements OnInit, OnDestroy {
  currentStep = 1;
  totalSteps = 4;
  courseForm!: FormGroup;
  coupons: ICoupon[] = [];
  offers: IOffer[] = [];
  private _subscription = new Subscription();
  courseId: string | null = null;
  isEditMode = false;

  constructor(
    private _fb: FormBuilder,
    private _courseService: CourseServiceService,
    private _couponService: CouponService,
    private _offerService: OfferService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    if (this.courseId) {
      this.isEditMode = true;
      this.loadCourseData(this.courseId);
    } else {
      this.addModule(); // For create mode
    }
    this.getAllCoupon();
    this.getAllOffer();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  get coursePreview() {
    return this.courseForm.value;
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

  loadCourseData(courseId: string): void {
    this._courseService.getCourses().subscribe({
      next: (response) => {
        const course = response.result.find((c: any) => c._id === courseId);
        if (course) {
          this.courseForm.patchValue({
            title: course.title,
            description: course.description,
            category: course.category,
            difficultyLevel: course.difficultyLevel,
            price: course.price,
            coupon: course.coupon || '',
            offer: course.offer || '',
          });

          const modulesArray = this.modulesArray;
          modulesArray.clear(); // Clear existing modules
          course.modules.forEach((module: any) => {
            const lessonsArray = this._fb.array(
              module.lessons.map((lesson: any) =>
                this._fb.group({
                  title: [lesson.title, Validators.required],
                  content: [lesson.content, Validators.required],
                  document: [lesson.documentKey || null], // Use documentKey for existing files
                })
              )
            );
            const moduleGroup = this._fb.group({
              title: [module.title, Validators.required],
              lessons: lessonsArray,
            });
            modulesArray.push(moduleGroup);
          });

          // Populate assignments, quizzes, liveClasses if needed
          this.loadAssignments(course.assignments);
          this.loadQuizzes(course.quizzes);
          this.loadLiveClasses(course.liveClasses);
        }
      },
      error: (error) => console.error('Error loading course:', error),
    });
  }

  loadAssignments(assignments: any[]): void {
    const assignmentsArray = this.getAssignmentsArray();
    assignmentsArray.clear();
    assignments.forEach((assignment: any) => {
      assignmentsArray.push(
        this._fb.group({
          assignmentTitle: [assignment.assignmentTitle, Validators.required],
          assignmentDescription: [assignment.assignmentDescription, Validators.required],
        })
      );
    });
  }

  loadQuizzes(quizzes: any[]): void {
    const quizzesArray = this.getQuizzesArray();
    quizzesArray.clear();
    quizzes.forEach((quiz: any) => {
      const questionsArray = this._fb.array(
        quiz.questions.map((question: any) =>
          this._fb.group({
            questionText: [question.questionText, Validators.required],
            options: this._fb.array(
              question.options.map((option: any) =>
                this._fb.group({
                  optionText: [option.optionText, Validators.required],
                  isCorrect: [option.isCorrect],
                })
              )
            ),
          })
        )
      );
      quizzesArray.push(
        this._fb.group({
          title: [quiz.title, Validators.required],
          questions: questionsArray,
        })
      );
    });
  }

  loadLiveClasses(liveClasses: any[]): void {
    const liveClassesArray = this.getLiveClassesArray();
    liveClassesArray.clear();
    liveClasses.forEach((liveClass: any) => {
      liveClassesArray.push(
        this._fb.group({
          title: [liveClass.title, Validators.required],
          scheduleDate: [liveClass.scheduleDate, Validators.required],
          duration: [liveClass.duration, Validators.required],
          meetingLink: [liveClass.meetingLink, Validators.required],
        })
      );
    });
  }

  getAllCoupon(): void {
    this._subscription.add(
      this._couponService.getCoupons().subscribe({
        next: (response) => (this.coupons = response.result),
        error: (error) => console.error(error),
      })
    );
  }

  getAllOffer(): void {
    this._subscription.add(
      this._offerService.getOffers().subscribe({
        next: (response) => (this.offers = response.result),
        error: (error) => console.error(error),
      })
    );
  }

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
        return (
          this.courseForm.get('title')?.valid &&
          this.courseForm.get('description')?.valid &&
          this.courseForm.get('category')?.valid &&
          this.courseForm.get('difficultyLevel')?.valid
        ) || false;
      case 2:
        return this.modulesArray.valid;
      case 3:
        return true; // Adjust as needed
      case 4:
        return this.courseForm.get('price')?.valid || false;
      default:
        return true;
    }
  }

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
    this.addLesson(this.modulesArray.length - 1);
  }

  deleteModule(moduleIndex: number): void {
    this.modulesArray.removeAt(moduleIndex);
  }

  addLesson(moduleIndex: number): void {
    const lessonGroup = this._fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      document: [null],
    });
    this.getLessonsArray(moduleIndex).push(lessonGroup);
  }

  deleteLesson(moduleIndex: number, lessonIndex: number): void {
    this.getLessonsArray(moduleIndex).removeAt(lessonIndex);
  }

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

  onFileChange(event: Event, moduleIndex: number, lessonIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const lessonControl = this.getLessonsArray(moduleIndex).at(lessonIndex);
      lessonControl.patchValue({ document: file });
      console.log('Selected file:', file.name, file.size, file.type);
    }
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const courseData = this.courseForm.value;
      const files: File[] = [];
      const formData = new FormData();

      courseData.modules.forEach((module: any) => {
        module.lessons.forEach((lesson: any) => {
          if (lesson.document instanceof File) {
            files.push(lesson.document);
          }
        });
      });

      const courseDataWithoutFiles = {
        ...courseData,
        modules: courseData.modules.map((module: any) => ({
          title: module.title,
          lessons: module.lessons.map((lesson: any) => ({
            title: lesson.title,
            content: lesson.content,
            document: lesson.document instanceof File ? undefined : lesson.document,
          })),
        })),
      };

      formData.append('courseData', JSON.stringify(courseDataWithoutFiles));
      files.forEach((file) => formData.append('documents', file));

      const request = this.isEditMode && this.courseId
        ? this._courseService.updateCourse(this.courseId, formData)
        : this._courseService.createCourse(formData);

      this._subscription.add(
        request.subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: this.isEditMode ? 'Course Updated Successfully' : 'Course Created Successfully',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              background: 'rgb(8, 10, 24)',
              color: 'white',
            });
            this.router.navigate(['/instructor/courses']); 
          },
          error: (error) => {
            console.error('Error:', error);
            Swal.fire({
              icon: 'error',
              title: this.isEditMode ? 'Course Update Failed' : 'Course Creation Failed',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              background: 'rgb(8, 10, 24)',
              color: 'white',
            });
          },
        })
      );
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