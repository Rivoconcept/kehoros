import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface DepartmentOption extends SelectOption {}
interface ManagerOption extends SelectOption {}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {

  // Champs
  matricule      = '';
  first_name     = '';
  last_name      = '';
  email          = '';
  password       = '';
  confirmPassword = '';
  countryCode    = '+261';
  phoneNumber    = '';
  manager_id = '';
  department_id = '';

  departmentOptions: DepartmentOption[] = [];
  managerOptions: ManagerOption[] = [];

  // UI state
  loading      = false;
  error        = '';
  phoneError   = '';
  showPassword = false;
  showConfirm  = false;

  // Liste des pays (principaux + Madagascar en premier)
  countries: Country[] = [
    { code: 'MG', name: 'Madagascar',      dial: '+261', flag: '🇲🇬' },
    { code: 'FR', name: 'France',          dial: '+33',  flag: '🇫🇷' },
    { code: 'CM', name: 'Cameroun',        dial: '+237', flag: '🇨🇲' },
    { code: 'SN', name: 'Sénégal',         dial: '+221', flag: '🇸🇳' },
    { code: 'CI', name: "Côte d'Ivoire",   dial: '+225', flag: '🇨🇮' },
    { code: 'MA', name: 'Maroc',           dial: '+212', flag: '🇲🇦' },
    { code: 'TN', name: 'Tunisie',         dial: '+216', flag: '🇹🇳' },
    { code: 'US', name: 'États-Unis',      dial: '+1',   flag: '🇺🇸' },
    { code: 'GB', name: 'Royaume-Uni',     dial: '+44',  flag: '🇬🇧' },
    { code: 'DE', name: 'Allemagne',       dial: '+49',  flag: '🇩🇪' },
    { code: 'CN', name: 'Chine',           dial: '+86',  flag: '🇨🇳' },
    { code: 'IN', name: 'Inde',            dial: '+91',  flag: '🇮🇳' },
  ];

  constructor(private authService: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadOptions();
  }

  private loadOptions() {
    forkJoin({
      departments: this.api.get<{ id: string; name: string }[]>('/departments'),
      managers: this.api.get<{ id: string; first_name: string; last_name: string }[]>('/users/managers'),
    }).subscribe({
      next: ({ departments, managers }) => {
        this.departmentOptions = departments.map(department => ({
          value: department.id,
          label: department.name,
        }));

        this.managerOptions = managers.map(manager => ({
          value: manager.id,
          label: `${manager.first_name} ${manager.last_name}`,
        }));
      },
      error: () => {
        this.departmentOptions = [];
        this.managerOptions = [];
      },
    });
  }

  // Validation téléphone
  onPhoneInput() {
    const digits = this.phoneNumber.replace(/\D/g, '');
    if (this.phoneNumber && digits.length < 6) {
      this.phoneError = 'Numéro trop court';
    } else if (digits.length > 15) {
      this.phoneError = 'Numéro trop long';
    } else {
      this.phoneError = '';
    }
  }

  get fullPhone(): string {
    if (!this.phoneNumber) return '';
    return `${this.countryCode}${this.phoneNumber.replace(/\s/g, '')}`;
  }

  // Force du mot de passe
  get strengthScore(): number {
    const p = this.password;
    let score = 0;
    if (p.length >= 8)              score++;
    if (/[A-Z]/.test(p))           score++;
    if (/[0-9]/.test(p))           score++;
    if (/[^A-Za-z0-9]/.test(p))   score++;
    return score;
  }

  get strengthClass(): string {
    return ['', 'weak', 'fair', 'good', 'strong'][this.strengthScore] || '';
  }

  get strengthWidth(): string {
    return `${this.strengthScore * 25}%`;
  }

  get strengthLabel(): string {
    return ['', 'Faible', 'Moyen', 'Bon', 'Fort'][this.strengthScore] || '';
  }

  onSubmit() {
    this.error = '';

    if (!this.first_name || !this.last_name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (this.phoneNumber && this.phoneError) {
      this.error = 'Numéro de téléphone invalide.';
      return;
    }

    this.loading = true;

    this.authService.register({
      first_name:  this.first_name,
      last_name:   this.last_name,
      email:       this.email,
      password:    this.password,
      matricule:   this.matricule   || undefined,
      phone:       this.fullPhone   || undefined,
      manager_id:  this.manager_id || undefined,
      department_id: this.department_id || undefined,
    }).subscribe({
      next: () => this.authService.redirectByRole(),
      error: (err) => {
        this.error   = err?.error?.message ?? err?.message ?? 'Une erreur est survenue.';
        this.loading = false;
      },
    });
  }
}