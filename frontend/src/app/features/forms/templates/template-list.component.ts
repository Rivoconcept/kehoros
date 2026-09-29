import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

import { FormsService } from '../services/forms.services';

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

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
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
  ],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.scss',
})
export class TemplateListComponent implements OnInit {
  private snackBar = inject(MatSnackBar);

  search = '';
  templates: TemplateCard[] = [];
  activeTab: 'active' | 'archived' = 'active';

  constructor(
    private router: Router,
    private formsService: FormsService,
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
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
      error: (error) => {
        console.error('Error fetching templates', error);
        this.showNotification('Error loading templates');
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

  createTemplate(): void {
    this.router.navigate(['/forms/builder', 'new']);
  }

  edit(template: TemplateCard): void {
    this.router.navigate(['/forms/builder', template.id]);
  }

  assign(template: TemplateCard): void {
    this.router.navigate(['/forms/assignments'], {
      queryParams: { template_id: template.id },
    });
  }

  duplicate(template: TemplateCard): void {
    this.formsService.duplicateTemplate(template.id).subscribe({
      next: () => {
        this.showNotification('Template duplicated successfully');
        this.loadTemplates();
      },
      error: (err) => {
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
      error: (err) => {
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
      error: (err) => {
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
        error: (err) => {
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