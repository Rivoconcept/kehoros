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
  matricule?: string;
  phone?: string;
  manager_id?: string;
  department_id?: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;

  isLoggedIn = signal<boolean>(this.hasToken());
  currentRole = signal<string>(this.getRole());

  constructor(private http: HttpClient, private router: Router) {}

  login(dto: LoginDto) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, dto).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        this.isLoggedIn.set(true);
        this.currentRole.set(this.getRole());
      })
    );
  }

  register(dto: RegisterDto) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, dto).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        this.isLoggedIn.set(true);
        this.currentRole.set(this.getRole());
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.isLoggedIn.set(false);
    this.currentRole.set('');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getPayload(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  getRole(): string {
    return this.getPayload()?.role || '';
  }

  updateRole(id:string,role:string){
    return this.http.patch(
        `${environment.apiUrl}/users/${id}/role`,
        {role}
    );
  }

  redirectByRole(): Promise<boolean> {
    const role = this.getRole();

    if (role === 'admin' || role === 'manager') {
      return this.router.navigate(['/dashboard']);
    }

    return this.router.navigate(['/my-forms']);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }
}