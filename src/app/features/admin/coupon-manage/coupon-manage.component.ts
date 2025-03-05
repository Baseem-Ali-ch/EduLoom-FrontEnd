import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { Subscription } from 'rxjs';
import { ICoupon } from '../../../core/models/IAdmin';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CouponService } from '../../../core/services/admin/coupon.service';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-coupon-manage',
  imports: [AdminSidebarComponent, CommonModule, FormsModule, ReactiveFormsModule, TableComponent],
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
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  private _subscription: Subscription = new Subscription();

  tableColumns = [
    { key: 'couponCode', label: 'Coupon Code' },
    { key: 'discount', label: 'Discount' },
    { key: 'minPurAmt', label: 'Min Purchase Amount' },
    { key: 'description', label: 'Description' },
    { key: 'expDate', label: 'Expiry Date' },
    { key: 'maxPurAmt', label: 'Max Purchase Amount' },
    { key: 'isActive', label: 'Status' },
    { key: 'actions', label: 'Actions', isAction: true },
  ];

  constructor(private _couponService: CouponService, private _fb: FormBuilder) {}

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
        this.allCoupon.unshift(newCoupon);
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
        this.isVisibleForm = false;
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
      complete: () => this._subscription.add(formSubmit),
    });
  }

  getAllCoupon() {
    const couponSubscription = this._couponService.getCoupons().subscribe({
      next: (response) => {
        this.allCoupon = response.result;
        this.filterCoupon();
      },
      error: (error) => console.error(error),
    });
    this._subscription.add(couponSubscription);
  }

  updateStatus(couponId: string, status: boolean) {
    const updateStatusSubscription = this._couponService.updateCouponStatus(couponId, status).subscribe({
      next: (response) => {
        const coupon = this.allCoupon.find((c) => c._id === couponId);
        if (coupon) {
          coupon.isActive = status;
          this.filterCoupon();
        }
        console.log(response);
      },
      error: (error) => console.error(error),
    });
    this._subscription.add(updateStatusSubscription);
  }

  filterCoupon() {
    this.filteredCoupon = this.allCoupon.filter((coupon) => {
      const matchesSearch = !this.searchTerm || coupon.couponCode.toLowerCase().includes(this.searchTerm.toLowerCase()) || coupon.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' || (this.selectedStatus === 'active' && coupon.isActive) || (this.selectedStatus === 'inactive' && !coupon.isActive);

      return matchesSearch && matchesStatus;
    });
    this.totalPages = Math.ceil(this.filteredCoupon.length / this.limit);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onActionClicked(event: { item: ICoupon; action: string }) {
    const { item, action } = event;
    switch (action) {
      case 'suspend':
      case 'activate':
        this.updateStatus(item._id!, action === 'activate');
        break;
      case 'edit':
        console.log('Edit coupon:', item);
        break;
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
