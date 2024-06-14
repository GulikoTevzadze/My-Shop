import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../shared/services/products.service';
import { Product } from '../../shared/types/product';
import { CommonModule} from '@angular/common';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  activatedRoute = inject(ActivatedRoute);
  productsServce = inject(ProductsService);

  readonly cartService = inject(CartService);
  product!: Product;

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params["id"];
    this.productsServce.getProductById(id).subscribe(p => this.product = p)
  }

  addToCart(id: string) {
    this.cartService.addToCart(id, 1);
  }
}
