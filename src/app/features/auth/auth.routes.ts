import { Routes } from '@angular/router';
import { SingInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const AUTH_ROUTES: Routes = [
  { path: 'sign-in', component: SingInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
];
