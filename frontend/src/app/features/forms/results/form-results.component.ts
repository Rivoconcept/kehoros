import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsService } from '../services/forms.services';

interface QuestionResult {
  id: string;
  label: string;
  type: string;
  userAnswer: unknown;
}

interface AssignmentResult {
  assignmentId: string;
  status: string;
  templateTitle: string;
  category: string;
  userName: string;
  userEmail: string;
  completedAt: Date;
  timeSpentMinutes: number;
  questions: QuestionResult[];
}

@Component({
  selector: 'app-form-results',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './form-results.component.html',
  styleUrl: './form-results.component.scss',
})
export class FormResultsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formsService = inject(FormsService);
  private readonly snackBar = inject(MatSnackBar);

  loading = true;
  result: AssignmentResult | null = null;

  ngOnInit(): void {
    const assignmentId = this.route.snapshot.paramMap.get('id');
    if (!assignmentId) {
      this.loading = false;
      return;
    }

    this.formsService.getAssignmentResult(assignmentId).subscribe({
      next: (data) => {
        this.result = {
          assignmentId,
          status: data.status || 'pending',
          templateTitle: data.template?.title || 'Form results',
          category: data.template?.category || 'General',
          userName: data.user
            ? `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim()
            : 'Unassigned user',
          userEmail: data.user?.email || '',
          completedAt: new Date(data.completed_at || data.updated_at),
          timeSpentMinutes: data.time_spent_minutes || 0,
          questions: data.questions || [],
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading assignment results', error);
        this.loading = false;
        this.snackBar.open('Unable to load results', 'Close', { duration: 3000 });
      },
    });
  }

  backToAssignments(): void {
    this.router.navigate(['/forms/assignments']);
  }
}