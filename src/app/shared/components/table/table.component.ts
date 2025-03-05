import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() data: any[] = []; 
  @Input() columns: { key: string; label: string; isAction?: boolean }[] = []; 
  @Input() currentPage: number = 1; 
  @Input() totalPages: number = 1; 
  @Input() limit: number = 10; 

  @Output() pageChange = new EventEmitter<number>(); 
  @Output() actionClicked = new EventEmitter<{ item: any; action: string }>(); 

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.limit;
    const endIndex = startIndex + this.limit;
    return this.data.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  // Handle action button clicks
  onActionClick(item: any, action: string) {
    this.actionClicked.emit({ item, action });
  }
}
