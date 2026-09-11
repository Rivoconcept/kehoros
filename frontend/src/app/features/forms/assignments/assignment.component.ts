// src/app/features/forms/assignments/assignment.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

export interface FormAssignment {
  id: string;
  template_id: string;
  template?: { title: string; description: string };
  user_id?: string;
  user?: { first_name: string; last_name: string; email: string };
  department_id?: string;
  department?: { name: string };
  status?: string;
  due_date?: string;
  created_at: string;
}

export interface FormTemplate {
  id: string;
  title: string;
}

export interface UserItem {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.scss',
})
export class AssignmentComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  userRole = this.authService.getRole();
  isAdminOrManager = this.userRole === 'admin' || this.userRole === 'manager';

  loading = false;
  assignments: FormAssignment[] = [];
  templates: FormTemplate[] = [];
  users: UserItem[] = [];

  assignForm!: FormGroup;
  displayedColumns: string[] = ['title', 'assignedTo', 'dueDate', 'status', 'actions'];

  ngOnInit(): void {
    if (this.isAdminOrManager) {
      this.initForm();
      this.loadFormData();
    } else {
      this.displayedColumns = ['title', 'dueDate', 'status', 'actions'];
    }

    this.loadAssignments();
  }

  initForm(): void {
    this.assignForm = this.fb.group({
      template_id: ['', Validators.required],
      user_id: [''],
      due_date: [''],
    });
  }

  loadFormData(): void {
    this.http.get<FormTemplate[]>(`${environment.apiUrl}/forms/templates`).subscribe({
      next: (res) => (this.templates = res),
      error: () => this.showNotification('Erreur lors du chargement des modèles'),
    });

    this.http.get<UserItem[]>(`${environment.apiUrl}/users`).subscribe({
      next: (res) => (this.users = res),
      error: () => this.showNotification('Erreur lors du chargement des utilisateurs'),
    });
  }

  loadAssignments(): void {
    this.loading = true;
    this.http.get<FormAssignment[]>(`${environment.apiUrl}/forms/assignments`).subscribe({
      next: (res) => {
        this.assignments = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showNotification('Erreur lors du chargement des assignations');
      },
    });
  }

  createAssignment(): void {
    if (this.assignForm.invalid) return;

    this.loading = true;
    this.http.post(`${environment.apiUrl}/forms/assignments`, this.assignForm.value).subscribe({
      next: () => {
        this.showNotification('Assignation créée avec succès');
        this.assignForm.reset();
        this.loadAssignments();
      },
      error: (err) => {
        this.loading = false;
        this.showNotification(err?.error?.message ?? 'Erreur lors de la création');
      },
    });
  }

  openPlayer(templateId: string): void {
    this.router.navigate(['/forms/player', templateId]);
  }

  private showNotification(msg: string): void {
    this.snackBar.open(msg, 'Fermer', { duration: 3000 });
  }
}