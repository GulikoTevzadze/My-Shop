import { Injectable, inject } from '@angular/core';
import { ENVIRONMENT } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Cart } from '../types/cart';
import { BehaviorSubject, EMPTY, catchError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private isInitialized = false;
  private readonly env = inject(ENVIRONMENT);

  private readonly baseUrl = `${this.env.apiUrl}/shop/cart`;
  cart$ = new BehaviorSubject<Cart | null>(null);

  get authHeaders() {
    return new HttpHeaders({
      accept: 'application/json',
      Authorization: `Bearer ${this.authService.accessToken}`,
    });
  }

  getCart() {
    this.httpClient
      .get<Cart>(this.baseUrl, { headers: this.authHeaders })
      .pipe(catchError(() => {
        this.cart$.next(null);
        return EMPTY
      }))
      .subscribe((cart) => {
        if(cart != null)
          this.isInitialized = true;
        this.cart$.next(cart);
      });
  }

  addToCart(id: string, quantity: number) {
    this.authService.validateLogin();
    if(!this.isInitialized)
      this.getCart();

    if (this.cart$.value) {
      this.httpClient
        .patch<Cart>(
          `${this.baseUrl}/product`,
          { id, quantity },
          { headers: this.authHeaders },
        )
        .subscribe((cart) => {
          this.cart$.next(cart);
          this.router.navigateByUrl("/cart")
        });
    } else {
      this.httpClient
        .post<Cart>(
          `${this.baseUrl}/product`,
          { id, quantity },
          { headers: this.authHeaders },
        )
        .pipe(catchError((e) =>
        {
          console.log(e);
          return EMPTY
        }))
        .subscribe((cart) => {
          this.cart$.next(cart);
          this.router.navigateByUrl("/cart")
        });
    }
  }

  removeFromCart(id: any) {
    this.httpClient
      .delete<Cart>(
        `${this.baseUrl}/product`,
        {
          headers: this.authHeaders,
          body: { id }
        }
      )
      .subscribe((r) => {
        this.getCart()
      });
  }

  checkout() {
    this.httpClient.post(`${this.baseUrl}/checkout`,
      {},
      { headers: this.authHeaders })
    .pipe(catchError(() => EMPTY))
    .subscribe(x => this.getCart())
  }
}
