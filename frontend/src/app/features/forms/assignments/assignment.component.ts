import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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

export interface DepartmentItem {
  id: string;
  name: string;
}

export interface UserItem {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  matricule?: string;
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
    MatInputModule,
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
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  userRole = this.authService.getRole();
  isAdminOrManager = this.userRole === 'admin' || this.userRole === 'manager';

  loading = false;
  assignments: FormAssignment[] = [];
  users: UserItem[] = [];
  departments: DepartmentItem[] = [];

  assignForm!: FormGroup;
  displayedColumns: string[] = ['title', 'assignedTo', 'dueDate', 'status', 'actions'];

  preselectedTemplateId: string | null = null;
  selectedTemplateTitle = '';

  ngOnInit(): void {
    this.preselectedTemplateId =
      this.route.snapshot.queryParamMap.get('template_id') ||
      this.route.snapshot.queryParamMap.get('templateId');

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
      template_title: [{ value: 'Loading template...', disabled: true }],
      target_type: ['USERS', Validators.required], 
      department_id: [''],
      user_ids: [[]],
      due_date: [''],
    });
  }

  getPublicUrl(): string {
    if (!this.preselectedTemplateId) return '';
    return `${window.location.origin}/forms/player/${this.preselectedTemplateId}`;
  }

  copyPublicLink(): void {
    const url = this.getPublicUrl();
    if (!url) return;

    navigator.clipboard.writeText(url).then(
      () => this.showNotification('🔗 Link copied to clipboard!'),
      () => this.showNotification('Failed to copy link')
    );
  }

  loadFormData(): void {
    if (this.preselectedTemplateId) {
      this.http.get<FormTemplate>(`${environment.apiUrl}/forms/templates/${this.preselectedTemplateId}`).subscribe({
        next: (template) => {
          this.selectedTemplateTitle = template.title;
          this.assignForm.patchValue({ template_title: template.title });
        },
        error: () => {
          this.http.get<FormTemplate[]>(`${environment.apiUrl}/forms/templates`).subscribe({
            next: (templates) => {
              const match = templates.find((t) => t.id === this.preselectedTemplateId);
              if (match) {
                this.selectedTemplateTitle = match.title;
                this.assignForm.patchValue({ template_title: match.title });
              } else {
                this.selectedTemplateTitle = this.preselectedTemplateId!;
                this.assignForm.patchValue({ template_title: this.preselectedTemplateId });
              }
            },
          });
        },
      });
    } else {
      this.assignForm.patchValue({ template_title: 'No template selected' });
    }

    this.http.get<UserItem[]>(`${environment.apiUrl}/users`).subscribe({
      next: (res) => (this.users = res),
      error: () => (this.users = []),
    });

    this.http.get<DepartmentItem[]>(`${environment.apiUrl}/departments`).subscribe({
      next: (res) => (this.departments = res),
      error: () => (this.departments = []),
    });
  }

  loadAssignments(): void {
    this.loading = true;
    this.http.get<FormAssignment[]>(`${environment.apiUrl}/forms/assignments`).subscribe({
      next: (res) => {
        this.assignments = [...res]; // Réassignation propre d'un nouveau tableau
        this.loading = false;
      },
      error: () => {
        this.assignments = [];
        this.loading = false;
        this.showNotification('Error loading assignments');
      },
    });
  }

  createAssignment(): void {
    if (this.assignForm.invalid || !this.preselectedTemplateId) return;

    this.loading = true;
    const rawValue = this.assignForm.getRawValue();

    let assignedBy = '';
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedPayload = JSON.parse(atob(token.split('.')[1]));
        assignedBy = decodedPayload.email || decodedPayload.matricule || decodedPayload.sub || '';
      } catch (e) {
        console.error('Error decoding JWT token:', e);
      }
    }

    if (!assignedBy) {
      assignedBy = 'rivo.k0949@keobiz.fr';
    }

    const formattedTargetType = rawValue.target_type || 'ALL';

    const payload: any = {
      template_id: this.preselectedTemplateId,
      target_type: formattedTargetType,
      assigned_by: assignedBy,
      department_id: formattedTargetType === 'DEPARTMENT' ? rawValue.department_id : null,
      user_ids: formattedTargetType === 'USERS' ? (rawValue.user_ids || []) : [],
      due_date: rawValue.due_date ? new Date(rawValue.due_date).toISOString() : null
    };

    this.http.post(`${environment.apiUrl}/forms/assignments`, payload).subscribe({
      next: () => {
        this.loading = false;
        this.showNotification('Assignment created successfully');
        
        // Réinitialiser les champs de sélection du formulaire
        this.assignForm.patchValue({
          user_ids: [],
          department_id: '',
          due_date: ''
        });

        this.loadAssignments();
      },
      error: (err) => {
        this.loading = false;
        console.error('Backend Validation Error Detail:', err.error);
        this.showNotification(`Error: ${err.error?.message || 'Failed to create assignment'}`);
      }
    });
  }

  openPlayer(templateId: string): void {
    this.router.navigate(['/forms/player', templateId]);
  }

  private showNotification(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }
}