import { Component, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../shared/services/products.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { AsyncPipe } from '@angular/common';
import { CartService } from '../../shared/services/cart.service';
import { Cart } from '../../shared/types/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ProductCardComponent, AsyncPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private productsService = inject(ProductsService);
  cartProducts$ = this.productsService.cartProducts$;
  private readonly cartService = inject(CartService);
  cart$ = this.cartService.cart$;
  cart: Cart | null = null;
  ngOnInit(): void {
    this.cartService.getCart();
    this.cart$.subscribe(cart => {
      if(cart?.products) {
        for (let product of cart?.products!) {
          this.productsService.getProductById(product.productId)
            .subscribe(details => {
              product.details = details
            })
        }
      }
      this.cart = cart;
    });
  }

  onDeleteProduct(id: string) {
    this.cartService.removeFromCart(id);
  }

  changeQuantity(id: any, quantity: number) {
    if (quantity === 0)
      this.onDeleteProduct(id);
    else
      this.cartService.addToCart(id, quantity);
  }

  getById(id: any) {
    return this.productsService.getProductById(id);
  }

  checkout() {
    return this.cartService.checkout();
  }
}
