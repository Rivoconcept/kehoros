import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

import { FormsService } from '../services/forms.services';
import { AssignFormDialogComponent } from '../dialogs/assign-form-dialog/assign-form-dialog.component';
import { AuthService } from '../../../core/services/auth.service';

interface TemplateCard {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  statusLabel: string;
  Questions: number;
  responses: number;
  createdBy: any;
  updatedAt: Date;
}

export interface FormAssignmentGroup {
  templateId: string;
  templateTitle: string;
  category: string;
  targetTypeLabel: string;
  totalAssigned: number;
  completedCount: number;
}

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatTableModule,
  ],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.scss',
})
export class TemplateListComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  search = '';
  templates: TemplateCard[] = [];
  activeTab: 'active' | 'archived' | 'assigned' = 'active';

  // Table Master
  assignedColumns: string[] = ['title', 'targetType', 'progress', 'actions'];
  assignedGroups: FormAssignmentGroup[] = [];

  constructor(
    private router: Router,
    private formsService: FormsService,
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
    this.loadAssignedForms();
  }

  loadTemplates(): void {
    this.formsService.getTemplates().subscribe({
      next: (data: any[]) => {
        this.templates = data.map((template) => {
          const rawStatus = (template.status || 'draft').toLowerCase();

          let statusLabel = 'Draft';
          if (rawStatus === 'published') statusLabel = 'Published';
          if (rawStatus === 'archived') statusLabel = 'Archived';

          return {
            id: template.id,
            title: template.title,
            description: template.description ?? '',
            category: template.category ?? 'General',
            status: rawStatus as 'draft' | 'published' | 'archived',
            statusLabel,
            Questions:
              template.questions?.length ??
              template.Questions?.length ??
              0,
            responses: template.responses?.length ?? 0,
            createdBy: template.createdBy ?? template.created_by ?? 'System',
            updatedAt: new Date(template.updated_at ?? template.updatedAt),
          };
        });
      },
      error: (error: any) => {
        console.error('Error fetching templates', error);
        this.showNotification('Error loading templates');
      },
    });
  }

  loadAssignedForms(): void {
    this.formsService.getAssignments().subscribe({
      next: (assignments: any[]) => {
        const groupsMap = new Map<string, FormAssignmentGroup>();

        assignments.forEach((assignment) => {
          const tId = assignment.template_id || assignment.template?.id;
          const tTitle = assignment.template?.title || 'Untitled Form';
          const category = assignment.template?.category || 'General';

          if (!groupsMap.has(tId)) {
            groupsMap.set(tId, {
              templateId: tId,
              templateTitle: tTitle,
              category: category,
              targetTypeLabel: assignment.target_type || 'All Users',
              totalAssigned: 0,
              completedCount: 0,
            });
          }

          const group = groupsMap.get(tId)!;
          group.totalAssigned++;
          if (assignment.status === 'completed') {
            group.completedCount++;
          }
        });

        this.assignedGroups = Array.from(groupsMap.values());
      },
      error: (err: any) => {
        console.error('Error fetching assignments', err);
      },
    });
  }

  getCreatedByLabel(createdBy: any): string {
    if (!createdBy) return 'System';

    if (typeof createdBy === 'object') {
      return (
        createdBy.registrationNumber ||
        createdBy.matricule ||
        createdBy.email ||
        'System'
      );
    }

    return createdBy;
  }

  get filteredTemplates(): TemplateCard[] {
    return this.templates.filter((template) => {
      const matchesSearch = template.title
        .toLowerCase()
        .includes(this.search.toLowerCase());

      const matchesTab =
        this.activeTab === 'archived'
          ? template.status === 'archived'
          : template.status !== 'archived';

      return matchesSearch && matchesTab;
    });
  }

  get filteredAssignedGroups(): FormAssignmentGroup[] {
    return this.assignedGroups.filter((group) =>
      group.templateTitle.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  onTabChange(index: number): void {
    if (index === 0) this.activeTab = 'active';
    else if (index === 1) this.activeTab = 'archived';
    else if (index === 2) {
      this.activeTab = 'assigned';
      this.loadAssignedForms();
    }
  }

  viewProgressPage(group: FormAssignmentGroup): void {
    this.router.navigate(['/forms/assignments'], {
      queryParams: { template_id: group.templateId },
    });
  }

  viewResults(template: TemplateCard): void {
    this.formsService.getAssignments().subscribe({
      next: (assignments) => {
        const candidates = assignments.filter((assignment) =>
          (assignment.template_id === template.id || assignment.template?.id === template.id) &&
          assignment.id,
        );
        const selected =
          candidates.find((assignment) => assignment.status?.toLowerCase() === 'completed') ??
          candidates[0];

        if (selected) {
          this.router.navigate(['/forms/results', selected.id]);
        } else {
          this.showNotification('No assignments found for this form');
        }
      },
      error: (err: any) => {
        console.error('Error fetching form results', err);
        this.showNotification('Error loading form results');
      },
    });
  }

  createTemplate(): void {
    this.router.navigate(['/forms/builder', 'new']);
  }

  edit(template: TemplateCard): void {
    this.router.navigate(['/forms/builder', template.id]);
  }

  assign(template: TemplateCard): void {
    const dialogRef = this.dialog.open(AssignFormDialogComponent, {
      width: '600px',
      data: {
        templateId: template.id,
        templateTitle: template.title,
      },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const payload = this.authService.getPayload();
      const assignedBy = payload?.sub || payload?.email;
      if (!assignedBy) {
        this.showNotification('Unable to identify the current user');
        return;
      }

      this.formsService.createAssignment({
        template_id: template.id,
        assigned_by: assignedBy,
        target_type: result.target_type,
        user_ids: result.user_ids || [],
        department_ids: result.department_ids || [],
      }).subscribe({
        next: () => {
          this.showNotification('Form assigned successfully');
          this.loadAssignedForms();
        },
        error: (err: any) => {
          console.error('Error assigning form', err);
          this.showNotification(err.error?.message || 'Error assigning form');
        },
      });
    });
  }

  duplicate(template: TemplateCard): void {
    this.formsService.duplicateTemplate(template.id).subscribe({
      next: () => {
        this.showNotification('Template duplicated successfully');
        this.loadTemplates();
      },
      error: (err: any) => {
        console.error('Error duplicating template', err);
        this.showNotification('Error duplicating template');
      },
    });
  }

  archive(template: TemplateCard): void {
    template.status = 'archived';
    template.statusLabel = 'Archived';
    this.templates = [...this.templates];

    this.formsService.archiveTemplate(template.id).subscribe({
      next: () => {
        this.showNotification('Template archived');
        this.loadTemplates();
      },
      error: (err: any) => {
        console.error('Error archiving template', err);
        this.loadTemplates();
      },
    });
  }

  restore(template: TemplateCard): void {
    template.status = 'draft';
    template.statusLabel = 'Draft';
    this.templates = [...this.templates];

    this.formsService.restoreTemplate(template.id).subscribe({
      next: () => {
        this.showNotification('Template restored');
        this.loadTemplates();
      },
      error: (err: any) => {
        console.error('Error restoring template', err);
        this.loadTemplates();
      },
    });
  }

  delete(template: TemplateCard): void {
    if (confirm(`Are you sure you want to delete "${template.title}"?`)) {
      this.templates = this.templates.filter((t) => t.id !== template.id);
      this.formsService.deleteTemplate(template.id).subscribe({
        next: () => {
          this.showNotification('Template deleted successfully');
          this.loadTemplates();
        },
        error: (err: any) => {
          console.error('Error deleting template', err);
          this.showNotification('Error deleting template');
          this.loadTemplates();
        },
      });
    }
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}