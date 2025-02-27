import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { Subscription } from 'rxjs';
import { ICoupon } from '../../../core/models/IAdmin';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CouponService } from '../../../core/services/admin/coupon.service';

@Component({
  selector: 'app-coupon-manage',
  imports: [AdminSidebarComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './coupon-manage.component.html',
  styleUrl: './coupon-manage.component.css',
})
export class CouponManageComponent {
  allCoupon: ICoupon[] = [];
  filteredCoupon: ICoupon[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';
  isVisibleForm: boolean = false;
  couponForm!: FormGroup;
  private _subscription: Subscription = new Subscription();

  constructor(private _couponService: CouponService, private _fb: FormBuilder) {}

  // ng on init
  ngOnInit(): void {
    this.getAllCoupon();
    this.form();
  }

  form(): void {
    this.couponForm = this._fb.group({
      couponCode: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      minPurAmt: ['', [Validators.required]],
      description: ['', [Validators.required]],
      expDate: ['', [Validators.required]],
      maxPurAmt: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  toggelForm() {
    this.isVisibleForm = !this.isVisibleForm;
  }

  onSubmit() {
    if (this.couponForm.get('status')?.value === 'active') {
      this.couponForm.get('status')?.setValue(true);
    } else {
      this.couponForm.get('status')?.setValue(false);
    }
    const formSubmit = this._couponService.addCoupon(this.couponForm.value).subscribe({
      next: (response) => {
        const newCoupon: ICoupon = response.result;
        this.filteredCoupon.unshift(newCoupon);
        Swal.fire({
          icon: 'success',
          title: response.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: 'rgb(8, 10, 24)',
          color: 'white',
        });
        this.couponForm.reset();
        this._subscription.add(formSubmit);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: error.error?.message,
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
    this.isVisibleForm = !this.isVisibleForm;
  }

  // fetch all user
  getAllCoupon() {
    const couponSubscription = this._couponService.getCoupons().subscribe({
      next: (response) => {
        this.allCoupon = response.result;
        this.filteredCoupon = response.result;
        console.log('all cou', response.result);
      },
      error: (error) => {
        console.error(error);
      },
    });
    this._subscription.add(couponSubscription);
  }

  // update instructor status
  updateStatus(couponId: string, status: boolean) {
    const updateStatusSubscription = this._couponService.updateCouponStatus(couponId, status).subscribe({
      next: (response) => {
        const coupon = this.allCoupon.find((i) => i._id === couponId);
        if (coupon) {
          coupon.status = status;
        }
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
    this._subscription.add(updateStatusSubscription);
  }

  // filter
  filterCoupon() {
    this.filteredCoupon = this.allCoupon.filter((coupon) => {
      const matchesSearch = !this.searchTerm || coupon.couponCode.toLowerCase().includes(this.searchTerm.toLowerCase()) || coupon.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' || (this.selectedStatus === 'active' && coupon.status) || (this.selectedStatus === 'inactive' && !coupon.status);

      return matchesSearch && matchesStatus;
    });
  }

  // ng on destroy
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
