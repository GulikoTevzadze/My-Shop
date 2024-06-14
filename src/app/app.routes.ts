import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { canActivateAuthenticated } from './shared/guards/can-activate-authenticated.guard';
import { canActivateUnauthenticated } from './shared/guards/can-activate-unauthenticated.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'cart',
    canActivate: [canActivateAuthenticated],
    loadComponent: () =>
      import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'auth',
    canActivate: [canActivateUnauthenticated],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product/product.component').then(
        (m) => m.ProductComponent
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
