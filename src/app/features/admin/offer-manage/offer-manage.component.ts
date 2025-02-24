import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { Subscription } from 'rxjs';
import { IOffer } from '../../../core/models/IAdmin';
import { OfferService } from '../../../core/services/admin/offer.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { response } from 'express';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offer-manage',
  imports: [AdminSidebarComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './offer-manage.component.html',
  styleUrl: './offer-manage.component.css',
})
export class OfferManageComponent {
  allOffers: IOffer[] = [];
  filteredOffers: IOffer[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';
  isVisibleForm: boolean = false;
  offerForm!: FormGroup;
  private _subscription: Subscription = new Subscription();

  constructor(private _offerService: OfferService, private _fb: FormBuilder) {}

  // ng on init
  ngOnInit(): void {
    this.getAllOffer();
    this.form();
  }

  form(): void {
    this.offerForm = this._fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  toggelForm() {
    this.isVisibleForm = !this.isVisibleForm;
  }

  onSubmit() {
    const formSubmit = this._offerService.addOffer(this.offerForm.value).subscribe({
      next: (response) => {
        const newOffer: IOffer = response.result;

        this.filteredOffers.unshift(newOffer);
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
        this.offerForm.reset();
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
  getAllOffer() {
    const offerSubscription = this._offerService.getOffers().subscribe({
      next: (response) => {
        console.log('offers', response.result);
        this.allOffers = response.result;
        this.filteredOffers = response.result;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this._subscription.add(offerSubscription);
  }

  // update instructor status
  updateStatus(offerId: string, status: boolean) {
    const updateStatusSubscription = this._offerService.updateOfferStatus(offerId, status).subscribe({
      next: (response) => {
        const offer = this.allOffers.find((i) => i._id === offerId);
        if (offer) {
          offer.isActive = status;
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
  filterOffer() {
    this.filteredOffers = this.allOffers.filter((offer) => {
      const matchesSearch = !this.searchTerm || offer.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || offer.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' || (this.selectedStatus === 'active' && offer.isActive) || (this.selectedStatus === 'inactive' && !offer.isActive);

      return matchesSearch && matchesStatus;
    });
  }

  // ng on destroy
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
