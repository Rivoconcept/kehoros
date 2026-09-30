import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FormsService } from '../services/forms.services';

export interface QuestionResult {
  id: string;
  label: string;
  type: string;
  userAnswer: any;
  correctAnswer?: any;
  isCorrect?: boolean;
  score?: number;
  maxScore?: number;
}

export interface AssignmentResultData {
  assignmentId: string;
  status: string;
  templateTitle: string;
  category: string;
  userName: string;
  userEmail: string;
  completedAt: Date;
  timeSpentMinutes?: number;
  totalScore?: number;
  maxTotalScore?: number;
  percentage?: number;
  isTest: boolean;
  questions: QuestionResult[];
}

@Component({
  selector: 'app-form-results',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './form-results.component.html',
  styleUrl: './form-results.component.scss',
})
export class FormResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private formsService = inject(FormsService);
  private snackBar = inject(MatSnackBar);

  loading = true;
  assignmentId: string | null = null;
  resultData: AssignmentResultData | null = null;

  ngOnInit(): void {
    this.assignmentId = this.route.snapshot.paramMap.get('id');
    if (this.assignmentId) {
      this.loadResults(this.assignmentId);
    } else {
      this.loading = false;
    }
  }

  loadResults(id: string): void {
    this.loading = true;
    this.formsService.getAssignmentResult(id).subscribe({
      next: (data: any) => {
        // Transformation des données reçues de l'API
        this.resultData = {
          assignmentId: id,
          status: data.status || 'pending',
          templateTitle: data.template?.title || 'Form Result',
          category: data.template?.category || 'General',
          userName: data.user ? `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() : 'Anonymous',
          userEmail: data.user?.email || '',
          completedAt: new Date(data.completed_at || data.updated_at),
          timeSpentMinutes: data.time_spent_minutes || 0,
          totalScore: data.total_score ?? 0,
          maxTotalScore: data.max_score ?? 100,
          percentage: data.max_score ? Math.round((data.total_score / data.max_score) * 100) : 0,
          isTest: data.is_test ?? true,
          questions: data.questions || [],
        };
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading result details', err);
        this.loading = false;
        this.snackBar.open('Error loading results', 'Close', { duration: 3000 });
      },
    });
  }

  exportPdf(): void {
    this.snackBar.open('Exporting result as PDF...', 'Close', { duration: 2000 });
  }

  goBack(): void {
    this.location.back();
  }
}