import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css',
})
export class EditModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() userData: any = {};
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  updateProfileForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.updateProfileForm = this.fb.group({
      userName: ['', [Validators.minLength(5)]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
    });
  }

  ngOnChanges() {
    if (this.userData) {
      this.updateProfileForm.patchValue({
        userName: this.userData.userName,
        phone: this.userData.phone,
      });
    }
  }

  onSubmit(): void {
    if (this.updateProfileForm.valid) {
      this.save.emit(this.updateProfileForm.value);
    }
  }
}
