import { Injectable, inject } from '@angular/core';
import { ENVIRONMENT } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, UrlTree } from '@angular/router';
import { AuthErrors, SignUpRequest } from '../types/auth';
import { BehaviorSubject, EMPTY, catchError } from 'rxjs';
import { SignInResponse } from '../types/response';
import { User } from '../types/user';
import { ApiError } from '../types/api-error';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly env = inject(ENVIRONMENT);
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = `${this.env.apiUrl}/auth`;

  errors$ = new BehaviorSubject<AuthErrors>({
    signUp: '',
    signIn: '',
  });

  user$ = new BehaviorSubject<User | null>(null);
  get accessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  get refreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  get isTokenValid() {
    const token = this.accessToken;
    if (!token) return false;

    if(this.isTokenExpired(token)) {
      const reftoken = this.refreshToken;
      if(!reftoken) return false;
      if(this.isTokenExpired(reftoken)) {
        this.refreshAccessToken();
      } else {
        return false;
      }
    }
    return true;
  }
  set accessToken(value: string) {
    localStorage.setItem('access_token', value);
  }

  set refreshToken(value: string) {
    localStorage.setItem('refresh_token', value);
  }
  init() {
    const token = this.accessToken;
    if (token) {
      const user = this.parseJwt(token);
      this.user$.next(user);
    }
  }

  signUp(data: SignUpRequest) {
    this.httpClient
      .post(`${this.baseUrl}/sign_up`, data)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          const error = errorResponse.error as ApiError;
          this.errors$.next({ ...this.errors$.value, signUp: error.error });
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.router.navigate(['/auth', 'sign-in'], {
          queryParams: { signUpSuccess: true },
        });
      });
  }

  refreshAccessToken() {
    this.httpClient
    .post<SignInResponse>(`${this.baseUrl}/refresh`, {})
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        const error = errorResponse.error as ApiError;
        this.errors$.next({ ...this.errors$.value, signIn: error.error });
        return EMPTY;
      }),
    ).subscribe(({ access_token }) => {
      this.accessToken = access_token;
    });
  }

  signIn(email: string, password: string) {
    this.httpClient
      .post<SignInResponse>(`${this.baseUrl}/sign_in`, { email, password })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          const error = errorResponse.error as ApiError;
          this.errors$.next({ ...this.errors$.value, signIn: error.error });
          return EMPTY;
        }),
      )
      .subscribe(({ access_token, refresh_token }) => {
        this.accessToken = access_token;
        this.refreshToken = refresh_token;
        const user = this.parseJwt(access_token);
        this.user$.next(user);
        this.router.navigate(['/']);
      });
  }

  signOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.user$.next(null);
    this.router.navigate(['/']);
  }
  parseJwt(token: string): User | null {
    try {
      return jwtDecode(token)
    } catch {
      return null;
    }
  }
  isTokenExpired(token: string) {
    const userObject = this.parseJwt(token);
    if (!userObject) return true;
    return userObject.exp < Date.now() / 1000;
  }
  canActivate(): boolean | UrlTree {
    if (this.isTokenValid) {
      return true;
    } else {
      return this.router.parseUrl('/auth/sign-in');
    }
  }

  validateLogin() {
    if(!this.isTokenValid)
      this.router.navigateByUrl('/auth/sign-in');
  }
}
