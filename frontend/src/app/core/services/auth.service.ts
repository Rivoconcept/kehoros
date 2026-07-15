import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;

  // Signal — l'état de connexion réactif
  isLoggedIn = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  login(dto: LoginDto) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, dto).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        this.isLoggedIn.set(true);
      })
    );
  }

  register(dto: RegisterDto) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, dto).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }
}