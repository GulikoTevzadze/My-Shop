import { Component, OnInit, inject } from '@angular/core';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { ProductsFilterPipe } from '../../shared/pipes/products-filter.pipe';
import { ProductsService } from '../../shared/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SliderComponent } from '../../shared/components/slider/slider.component';
import { CartService } from '../../shared/services/cart.service';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { SortProductBy } from '../../shared/types/product-query';

type Direction = 'asc' | 'desc';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductCardComponent,
    SliderComponent,
    FormsModule,
    ProductsFilterPipe,
    AsyncPipe,
    PaginatorComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly productsService = inject(ProductsService);
  readonly cartService = inject(CartService);
  _sortOrder: Direction = 'asc';
  _sortBy: SortProductBy = "price";
  _searchKeyword: string = "";
  pageSize = 10;
  pageIndex = 1;

  products$ = this.productsService.products$;
  pagination$ = this.productsService.productPagination$;

  get searchKeyword() {
    return this._searchKeyword;
  }

  set searchKeyword(keyword: string) {
    this._searchKeyword = keyword;
    this.pageIndex = 1;
    this.router.navigate([''], {
      queryParams: {
        searchKeyword: this._searchKeyword,
        page_index: this.pageIndex,
      },
      queryParamsHandling: "merge"
    });
  }

  get sortBy() {
    return this._sortBy;
  }

  set sortBy(column: SortProductBy) {
    this._sortBy = column as SortProductBy;
    this.router.navigate([''], {
      queryParams: {
        sortBy: this._sortBy,
      },
      queryParamsHandling: "merge"
    });
  }

  get sortOrder() {
    return this._sortOrder;
  }

  set sortOrder(order: Direction) {
    this._sortOrder = order;
    this.router.navigate([''], {
      queryParams: {
        sortOrder: this._sortOrder,
      },
      queryParamsHandling: "merge"
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((paramMap) => {
      const pageSize =
        Number(paramMap.get('page_size')) || this.pagination$.value.pageSize;
      const pageIndex =
        Number(paramMap.get('page_index')) || this.pagination$.value.pageIndex;

      this._searchKeyword = paramMap.get('searchKeyword') || "";
      this._sortBy = paramMap.get('sortBy') as SortProductBy || "price" as SortProductBy;
      this._sortOrder = paramMap.get('sortOrder') as Direction || "asc" as Direction;

      this.productsService.getProducts({
        page_size: pageSize,
        page_index: pageIndex,
        sort_by: this._sortBy,
        sort_direction: this.sortOrder,
        keywords: this.searchKeyword
      });
    });
  }

  onAddToCart(id: string) {
    this.cartService.addToCart(id, 1);
  }

  onPaginationChange(pageIndex: number, pageSize: number) {
    this.router.navigate(['.'], {
      queryParams: {
        page_index: pageIndex,
        page_size: pageSize,
      },
      queryParamsHandling: "merge"
    });
  }
}
