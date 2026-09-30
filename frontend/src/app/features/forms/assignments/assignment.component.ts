import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FormsService } from '../services/forms.services';

export interface FormAssignment {
  id: string;
  template_id: string;
  user_id: string;
  status: string;
  deadline?: Date | string;
  template?: { id?: string; title: string }; // <-- Ajout de id?: string
  user?: { first_name: string; last_name: string; email: string };
  department?: { name: string };
}

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.scss',
})
export class AssignmentsComponent implements OnInit {
  loading = false;
  isAdminOrManager = true; // À lier à votre service d'authentification
  templateIdFilter: string | null = null;

  assignments: FormAssignment[] = [];
  displayedColumns: string[] = ['title', 'assignedTo', 'dueDate', 'status', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formsService: FormsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.templateIdFilter = params['template_id'] || null;
      this.loadAssignments();
    });
  }

  loadAssignments(): void {
    this.loading = true;
    this.formsService.getAssignments().subscribe({
      next: (data: FormAssignment[]) => {
        if (this.templateIdFilter) {
          this.assignments = data.filter(
            (a) => a.template_id === this.templateIdFilter || a.template?.id === this.templateIdFilter
          );
        } else {
          this.assignments = data;
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading assignments', err);
        this.loading = false;
        this.snackBar.open('Error loading assignments', 'Close', { duration: 3000 });
      },
    });
  }

  openPlayer(templateId: string): void {
    this.router.navigate(['/forms/player', templateId]);
  }

  viewResults(assignment: FormAssignment): void {
    this.router.navigate(['/forms/results', assignment.id]);
  }

  cancelAssignment(assignment: FormAssignment): void {
    if (confirm(`Cancel assignment for ${assignment.user?.first_name || 'this user'}?`)) {
      this.formsService.cancelAssignment(assignment.id).subscribe({
        next: () => {
          this.snackBar.open('Assignment cancelled', 'Close', { duration: 3000 });
          this.loadAssignments();
        },
        error: (err: any) => {
          console.error('Error cancelling assignment', err);
          this.snackBar.open('Error cancelling assignment', 'Close', { duration: 3000 });
        },
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}