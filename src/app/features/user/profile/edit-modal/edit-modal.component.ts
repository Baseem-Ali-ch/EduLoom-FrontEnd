import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-edit-modal',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './edit-modal.component.html',
    styleUrl: './edit-modal.component.css'
})
export class EditModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() userData: any = {};
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  updateProfileForm!: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.form()
  }

  // update user details form
  form(): void {
    this.updateProfileForm = this._fb.group({
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
