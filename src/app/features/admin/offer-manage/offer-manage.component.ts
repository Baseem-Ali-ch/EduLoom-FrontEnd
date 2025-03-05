import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { Subscription } from 'rxjs';
import { IOffer } from '../../../core/models/IAdmin';
import { OfferService } from '../../../core/services/admin/offer.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { response } from 'express';
import Swal from 'sweetalert2';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-offer-manage',
  imports: [AdminSidebarComponent, CommonModule, FormsModule, ReactiveFormsModule, TableComponent],
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
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  private _subscription: Subscription = new Subscription();

  // Column configuration for the generic table
  tableColumns = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'discount', label: 'Discount' },
    { key: 'isActive', label: 'Status' },
    { key: 'actions', label: 'Actions', isAction: true }
  ];

  constructor(private _offerService: OfferService, private _fb: FormBuilder) {}

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
        this.allOffers.unshift(newOffer); // Add to allOffers too for consistency
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
      complete: () => this._subscription.add(formSubmit)
    });
  }

  getAllOffer() {
    const offerSubscription = this._offerService.getOffers().subscribe({
      next: (response) => {
        this.allOffers = response.result;
        this.filterOffer(); // Apply filters after fetching
      },
      error: (error) => console.error(error)
    });
    this._subscription.add(offerSubscription);
  }

  updateStatus(offerId: string, status: boolean) {
    const updateStatusSubscription = this._offerService.updateOfferStatus(offerId, status).subscribe({
      next: (response) => {
        const offer = this.allOffers.find((o) => o._id === offerId);
        if (offer) {
          offer.isActive = status;
          this.filterOffer(); 
        }
        console.log(response);
      },
      error: (error) => console.error(error)
    });
    this._subscription.add(updateStatusSubscription);
  }

  filterOffer() {
    this.filteredOffers = this.allOffers.filter((offer) => {
      const matchesSearch =
        !this.searchTerm ||
        offer.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'all' ||
        (this.selectedStatus === 'active' && offer.isActive) ||
        (this.selectedStatus === 'inactive' && !offer.isActive);

      return matchesSearch && matchesStatus;
    });
    this.totalPages = Math.ceil(this.filteredOffers.length / this.limit);
  }

  // Handle page changes from the table
  onPageChange(page: number) {
    this.currentPage = page;
    // If your API supports pagination, fetch new data here
    // For now, we'll rely on client-side pagination
  }

  // Handle actions from the table
  onActionClicked(event: { item: IOffer; action: string }) {
    const { item, action } = event;
    switch (action) {
      case 'suspend':
      case 'activate':
        this.updateStatus(item._id!, action === 'activate');
        break;
      case 'delete':
        console.log('Delete offer:', item); // Implement delete logic
        break;
      case 'edit':
        console.log('Edit offer:', item); // Implement edit logic
        break;
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
