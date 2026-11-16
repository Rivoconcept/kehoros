import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FormsService } from '../services/forms.services';
import { AssignFormDialogComponent } from '../dialogs/assign-form-dialog/assign-form-dialog.component';
import { AuthService } from '../../../core/services/auth.service';

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
        MatDialogModule,
    ],
    templateUrl: './assignment.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './assignment.component.scss'
})
export class AssignmentsComponent implements OnInit {
  loading = false;
  assignmentActionLoading = false;
  isAdminOrManager = true; // À lier à votre service d'authentification
  templateIdFilter: string | null = null;

  assignments: FormAssignment[] = [];
  displayedColumns: string[] = ['title', 'assignedTo', 'dueDate', 'status', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formsService: FormsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
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

  openPlayer(templateId: string, assignmentId?: string): void {
    this.router.navigate(['/forms/player', templateId], {
      queryParams: assignmentId ? { assignment_id: assignmentId } : {},
    });
  }

  viewResults(assignment: FormAssignment): void {
    this.router.navigate(['/forms/results', assignment.id]);
  }

  removeAssignment(assignment: FormAssignment): void {
    const userName = assignment.user?.first_name || 'this user';
    if (confirm(`Delete the assignment for ${userName}?`)) {
      this.formsService.deleteAssignment(assignment.id).subscribe({
        next: () => {
          this.snackBar.open('Assignment deleted', 'Close', { duration: 3000 });
          this.loadAssignments();
        },
        error: (err: any) => {
          console.error('Error deleting assignment', err);
          this.snackBar.open('Error deleting assignment', 'Close', { duration: 3000 });
        },
      });
    }
  }

  removeAllAssignments(): void {
    if (!this.templateIdFilter || !this.assignments.length) return;

    const count = this.assignments.length;
    if (!confirm(`Delete all ${count} assignment(s) for this form?`)) return;

    this.assignmentActionLoading = true;
    this.formsService.deleteAssignmentsForTemplate(this.templateIdFilter).subscribe({
      next: ({ deleted }) => {
        this.assignmentActionLoading = false;
        this.snackBar.open(`${deleted} assignment(s) deleted`, 'Close', {
          duration: 3000,
        });
        this.loadAssignments();
      },
      error: (err: any) => {
        console.error('Error deleting form assignments', err);
        this.assignmentActionLoading = false;
        this.snackBar.open(
          err?.error?.message ?? 'Error deleting form assignments',
          'Close',
          { duration: 3000 },
        );
      },
    });
  }

  addIndividualAssignment(): void {
    if (!this.templateIdFilter || this.assignmentActionLoading) return;

    this.assignmentActionLoading = true;
    this.formsService.getEligibleUsers(this.templateIdFilter).subscribe({
      next: (users: any[]) => {
        this.assignmentActionLoading = false;
        if (!users.length) {
          this.snackBar.open('There are no eligible users to assign', 'Close', {
            duration: 3000,
          });
          return;
        }

        const dialogRef = this.dialog.open(AssignFormDialogComponent, {
          width: '600px',
          data: {
            templateId: this.templateIdFilter,
            templateTitle:
              this.assignments[0]?.template?.title ?? 'Selected form',
            employees: users.map((user) => ({
              id: user.id,
              name: `${user.first_name} ${user.last_name}`,
              matricule: user.matricule,
            })),
            individualOnly: true,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (!result?.user_id) return;

          const payload = this.authService.getPayload();
          const assignedBy = payload?.sub || payload?.email;
          if (!assignedBy) {
            this.snackBar.open('Unable to identify the current user', 'Close', {
              duration: 3000,
            });
            return;
          }

          this.assignmentActionLoading = true;
          this.formsService.createAssignment({
            template_id: this.templateIdFilter!,
            assigned_by: assignedBy,
            target_type: 'INDIVIDUAL',
            user_ids: [result.user_id],
          }).subscribe({
            next: () => {
              this.assignmentActionLoading = false;
              this.snackBar.open('Assignment added', 'Close', {
                duration: 3000,
              });
              this.loadAssignments();
            },
            error: (err: any) => {
              console.error('Error adding assignment', err);
              this.assignmentActionLoading = false;
              this.snackBar.open(
                err?.error?.message ?? 'Error adding assignment',
                'Close',
                { duration: 3000 },
              );
            },
          });
        });
      },
      error: (err: any) => {
        console.error('Error loading eligible users', err);
        this.assignmentActionLoading = false;
        this.snackBar.open(
          err?.error?.message ?? 'Error loading eligible users',
          'Close',
          { duration: 3000 },
        );
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}