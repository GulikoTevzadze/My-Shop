import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, RouterLink, AsyncPipe],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SingInComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  errorMessage$ = this.authService.errors$.pipe(map((error) => error.signIn));
  

  isSignUpSuccess = false;
  email = '';
  password = '';
  keepSignedIn = false;

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((queryParamMap) => {
      this.isSignUpSuccess = Boolean(queryParamMap.get('signUpSuccess'));
    });
  }

  onSingIn() {
    this.authService.signIn(this.email, this.password);
  }
}
