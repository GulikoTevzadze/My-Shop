import { JsonPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Gender } from '../../../shared/types/user';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, TitleCasePipe],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  private readonly maxNameLength = 16;
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  readonly genderOptions = [Gender.Male, Gender.Female, Gender.Other];

  signupForm = this.fb.group({
    firstName: [
      '',
      [Validators.required, Validators.maxLength(this.maxNameLength)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.maxLength(this.maxNameLength)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    zipcode: ['', [Validators.required]],
    avatar: ['https://api.dicebear.com/8.x/lorelei/svg', []],
    gender: [Gender.Other, [Validators.required]],
    age: [18, [Validators.required, Validators.min(18)]],
  });

  get controls() {
    return this.signupForm.controls;
  }

  ngOnInit(): void {
    this.signupForm.addValidators(this.passwordsMatchValidator());
  }

  onSubmit() {
    console.log('hi');
    const signUpData = this.signupForm.getRawValue();
    this.authService.signUp(signUpData);
  }

  passwordsMatchValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.password === control.value.confirmPassword
        ? null
        : {
            passwordsMatch: 'Passwords do not match!',
          };
    };
  }
}
