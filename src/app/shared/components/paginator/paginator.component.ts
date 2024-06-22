import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  @Input({ required: true }) pageSize!: number;
  @Input({ required: true }) pageIndex!: number;
  @Input({ required: true }) total = 0;
  @Input() sizeOptions: number[] = [5, 10, 15];
  @Output() pageChange = new EventEmitter<{ pageSize: number, pageIndex: number }>();
 

  get totalPages() {
    var totalPages = Math.ceil(this.total / this.pageSize) || 1;
    return Array(totalPages).fill(1)
  }

  previousPage() {
    if (this.pageIndex > 1)
      this.pageChange.emit({ pageSize: this.pageSize, pageIndex: this.pageIndex - 1 });
    else
      this.pageChange.emit({ pageSize: this.pageSize, pageIndex: this.totalPages.length });
  }

  nextPage() {
    if (this.pageIndex < this.totalPages.length)
      this.pageChange.emit({ pageSize: this.pageSize, pageIndex: this.pageIndex + 1 });
    else
      this.pageChange.emit({ pageSize: this.pageSize, pageIndex: 1 });
  }

  changePageSize() {
    this.pageChange.emit({ pageSize: this.pageSize, pageIndex: 1 });
  }

  changePage(page: number) {
    this.pageChange.emit({ pageSize: this.pageSize, pageIndex: page });
  }
}
