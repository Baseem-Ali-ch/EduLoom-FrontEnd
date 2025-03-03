import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ICourse } from '../../../core/models/ICourse';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CourseServiceService } from '../../../core/services/instructor/course.service.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-course-det',
  imports: [SidebarComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './course-det.component.html',
  styleUrl: './course-det.component.css',
})
export class CourseDetComponent implements OnInit, OnDestroy {
  courseId: string | null = '';
  allCourses: ICourse[] = [];
  course!: ICourse | null;
  selectedLesson: any = null;
  selectedDoc: any = null;
  activeTab: string = 'Modules';
  tabs: string[] = ['Modules', 'Assignments', 'Quizzes', 'Live Classes'];
  isLoading = true;
  expandedModules: boolean[] = [];
  documents: { [key: string]: string } = {};
  showModal: boolean = false;
  assignmentForm!: FormGroup;
  selectedAssignmentId: string | null = null;
  submissions: { [assignmentId: string]: string } = {};
  showQuizModal: boolean = false;
  selectedQuiz: any = null;
  currentQuestionIndex: number = 0;
  answers: { [questionId: string]: string } = {};
  quizResults: { correct: number; wrong: number; skipped: number } = { correct: 0, wrong: 0, skipped: 0 };
  totalMark: number = 0;
  previouseQuizMark: number = 0;
  isEnrolled: boolean = false;
  coupons: any[] = [];
  offers: any[] = [];
  selectedCoupon: string = '';
  selectedOffer: string = '';
  discountedAmount: number = 0;
  showEnrollModal: boolean = false;
  private _subscription: Subscription = new Subscription();

  constructor(private _route: ActivatedRoute, private _courseService: CourseServiceService, private _fb: FormBuilder,  private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.courseId = this._route.snapshot.paramMap.get('id');
    this.getCourse();
    this.getDocumentSignedUrl();
    this.assingmentForm();
    this.loadSubmissions(this.courseId as string);
    this.checkEnrollmentStatus(this.courseId as string);
  }

  assingmentForm() {
    this.assignmentForm = this._fb.group({
      link: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  loadSubmissions(courseId: string): void {
    this._subscription.add(
      this._courseService.getStudentSubmissions(courseId).subscribe({
        next: (response) => {
          this.submissions = response.result.reduce((acc: any, sub: any) => {
            acc[sub.assignmentId] = sub.link;
            return acc;
          }, {});
        },
        error: (error) => console.error('Error fetching submissions:', error),
      })
    );
  }

  openAssignmentModal(assignmentId: string): void {
    this.selectedAssignmentId = assignmentId;
    this.showModal = true;
    const existingLink = this.submissions[assignmentId];
    this.assignmentForm.patchValue({ link: existingLink || '' });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedAssignmentId = null;
    this.assignmentForm.reset();
  }

  submitOrUpdateAssignment(): void {
    if (this.assignmentForm.valid && this.selectedAssignmentId) {
      const link = this.assignmentForm.value.link;
      const courseId = this.course?._id as string;
      const isUpdate = !!this.submissions[this.selectedAssignmentId];

      this._subscription.add(
        this._courseService.submitAssignment(courseId, this.selectedAssignmentId, link).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: isUpdate ? 'Assignment Updated Successfully' : 'Assignment Submitted Successfully',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              background: 'rgb(8, 10, 24)',
              color: 'white',
            });
            this.submissions[this.selectedAssignmentId!] = link;
            this.closeModal();
          },
          error: (error) => {
            console.error('Error:', error);
            Swal.fire({
              icon: 'error',
              title: isUpdate ? 'Update Failed' : 'Submission Failed',
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
      this.assignmentForm.markAllAsTouched();
    }
  }

  hasSubmission(assignmentId: string): boolean {
    return !!this.submissions[assignmentId];
  }

  getCourse() {
    const courseSubscription = this._courseService.getCourses().subscribe({
      next: (response) => {
        this.allCourses = response.result;
        this.isLoading = false;
        this.course = this.allCourses.find((course) => course._id === this.courseId) || null;
        if (response.modules?.length && response.modules[0].lessons?.length) {
          this.selectedLesson = response.modules[0].lessons[0];
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
    this._subscription.add(courseSubscription);
  }

  getDocumentSignedUrl(): void {
    const courseId = this._route.snapshot.paramMap.get('id') || '';
    if (courseId) {
      const documentSubscription = this._courseService.getDocSignedUrl(courseId).subscribe({
        next: (response) => {
          this.documents = response.result;
          this.course?.modules.forEach((module: any) => {
            module.lessons.forEach((lesson: any) => {
              if (lesson.document && this.documents[lesson.document]) {
                lesson.document = this.documents[lesson.document];
              }
            });
          });
        },
        error: (error) => {
          console.error('Error fetching signed URLs:', error);
        },
      });
      this._subscription.add(documentSubscription);
    }
  }

  selectLesson(lesson: any): void {
    // Reset to force re-render
    this.selectedLesson = null;
    setTimeout(() => {
      this.selectedLesson = lesson;
      console.log('Selected lesson:', lesson.document);
      this._cdr.detectChanges(); // Force change detection
    }, 0); // Zero timeout ensures DOM update
  }

 

  toggleModule(index: number): void {
    this.expandedModules[index] = !this.expandedModules[index];
  }

  openQuizModal(quiz: any): void {
    this.selectedQuiz = quiz;
    this.showQuizModal = true;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.quizResults = { correct: 0, wrong: 0, skipped: 0 };
  }

  closeQuizModal(): void {
    this.showQuizModal = false;
    this.selectedQuiz = null;
  }

  selectAnswer(questionId: string, optionText: string): void {
    this.answers[questionId] = optionText;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.selectedQuiz.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  skipQuestion(): void {
    const questionId = this.selectedQuiz.questions[this.currentQuestionIndex]._id;
    if (!this.answers[questionId]) {
      this.quizResults.skipped++;
    }
    this.nextQuestion();
  }

  submitQuiz(): void {
    const courseId = this.course?._id as string;
    const quizId = this.selectedQuiz._id;

    // Calculate total marks
    this.totalMark = 0;
    for (let question of this.selectedQuiz.questions) {
      const studentAnswer = this.answers[question._id];
      const correctAnswer = question.options.find((opt: any) => opt.isCorrect)?.optionText;
      if (studentAnswer && studentAnswer === correctAnswer) {
        this.totalMark += 1;
      }
    }

    const totalQuestions = this.selectedQuiz.questions.length;
    const percentage = (this.totalMark / totalQuestions) * 100;

    // Store results in local storage
    const quizResult = {
      totalMark: this.totalMark,
      totalQuestions: totalQuestions,
      percentage: percentage.toFixed(2),
      date: new Date().toISOString(),
    };
    localStorage.setItem(`quiz_${quizId}`, JSON.stringify(quizResult));

    // Display results
    const resultsMessage = `
      Score: ${this.totalMark}/${totalQuestions}<br>
      Percentage: ${percentage.toFixed(2)}%
    `;

    if (percentage >= 80) {
      Swal.fire({
        icon: 'success',
        title: 'Congratulations!',
        html: `You’ve excelled with a score of ${percentage.toFixed(2)}%!<br>${resultsMessage}`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        background: 'rgb(8, 10, 24)',
        color: 'white',
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Quiz Completed',
        html: resultsMessage,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        background: 'rgb(8, 10, 24)',
        color: 'white',
      });
    }

    this.closeQuizModal();
  }

  getQuizButtonText(quizId: string): string {
    if (!this.isEnrolled) return 'Take Quiz';
    const storedResult = localStorage.getItem(`quiz_${quizId}`);
    if (storedResult) {
      const { percentage } = JSON.parse(storedResult);
      return parseFloat(percentage) >= 80 ? 'You Are Done' : 'Retake Quiz';
    }
    return 'Take Quiz';
  }

  getQuizButtonClass(quizId: string): string {
    if (!this.isEnrolled) return 'bg-blue-500 hover:bg-blue-600';
    const storedResult = localStorage.getItem(`quiz_${quizId}`);
    if (storedResult) {
      const { percentage } = JSON.parse(storedResult);
      return parseFloat(percentage) >= 80 ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600';
    }
    return 'bg-blue-500 hover:bg-blue-600';
  }

  getCurrentQuestion() {
    return this.selectedQuiz?.questions[this.currentQuestionIndex];
  }

  checkEnrollmentStatus(courseId: string): void {
    this._subscription.add(
      this._courseService.checkEnrollment(courseId).subscribe({
        next: (response) => {
          this.isEnrolled = response.isEnrolled;
        },
        error: (error) => console.error('Error checking enrollment:', error),
      })
    );
  }

  loadCouponsAndOffers(): void {
    this._subscription.add(
      this._courseService.getCouponsAndOffers().subscribe({
        next: (response) => {
          this.coupons = response.result;
        },
        error: (error) => console.error('Error fetching coupons/offers:', error),
      })
    );
  }

  openEnrollModal(): void {
    this.showEnrollModal = true;
    this.loadCouponsAndOffers();
    this.selectedCoupon = '';
    this.selectedOffer = '';
    this.discountedAmount = this.course?.price as number;
  }

  closeEnrollModal(): void {
    this.showEnrollModal = false;
  }

  applyCouponOrOffer(): void {
    let discount = 0;
    const originalAmount = this.course?.price as number;

    if (this.selectedCoupon) {
      const coupon = this.coupons.find((c) => c._id === this.selectedCoupon);
      if (coupon) discount += coupon.discount;
    }

    if (this.selectedOffer) {
      const offer = this.offers.find((o) => o._id === this.selectedOffer);
      if (offer) discount += offer.discount;
    }

    this.discountedAmount = Math.max(0, originalAmount - discount);
  }

  async initiatePayment(): Promise<void> {
    const courseId = this.course?._id as string;
    const amount = this.discountedAmount * 100; // Razorpay uses paise

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);

    script.onload = () => {
      this._subscription.add(
        this._courseService.createRazorpayOrder(courseId, amount).subscribe({
          next: (response) => {
            const options = {
              key: environment.RAZORPAY_KEY_ID,
              amount: response.amount,
              currency: response.currency,
              name: 'EduLoom',
              description: `Enrollment for ${this.course?.title}`,
              order_id: response.id,
              handler: (paymentResponse: any) => {
                this.verifyPayment(paymentResponse, courseId);
              },
              prefill: {
                name: 'Student Name',
                email: 'student@example.com',
              },
              theme: { color: '#686CFD' },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          },
          error: (error) => {
            console.error('Error creating order:', error);
            Swal.fire({
              icon: 'error',
              title: 'Payment Initiation Failed',
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
    };
  }

  verifyPayment(paymentResponse: any, courseId: string): void {
    this._subscription.add(
      this._courseService
        .verifyPayment({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          courseId,
        })
        .subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.isEnrolled = true;
              Swal.fire({
                icon: 'success',
                title: 'Enrollment Successful',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: 'rgb(8, 10, 24)',
                color: 'white',
              });
              this.closeEnrollModal();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Payment Verification Failed',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: 'rgb(8, 10, 24)',
                color: 'white',
              });
            }
          },
          error: (error) => {
            console.error('Error verifying payment:', error);
            Swal.fire({
              icon: 'error',
              title: 'Payment Verification Failed',
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
  }

  isContentLocked(tab: string, index?: number): boolean {
    if (this.isEnrolled) return false;
    if (tab === 'Modules' && index === 0) return false;
    return true;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
