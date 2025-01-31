import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-instructor-req',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './instructor-req.component.html',
  styleUrl: './instructor-req.component.css',
})
export class InstructorReqComponent implements OnInit {
  @Input() isInstructorOpen = false;
  @Input() instructorData: any = {};
  @Output() instructorClose = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  instructorDetailsForm!: FormGroup;
  email: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.instructorDetailsForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(5)]],
      // email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'), // Better pattern for phone numbers
        ],
      ],
      place: ['', [Validators.required]],
      state: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      workExperience: ['', [Validators.required]],
      lastWorkingPlace: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      linkedinProfile: [''],
    });
  }



  onSubmit(): void {
    if (this.instructorDetailsForm.valid) {
      this.save.emit(this.instructorDetailsForm.value);
    }
  }
}
