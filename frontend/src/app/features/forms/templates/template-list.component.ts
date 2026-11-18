import { Component, OnInit, ViewChild, inject, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize, timeout } from 'rxjs';

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
    MenuModule,
    ButtonModule,
    CardModule,
    TagModule,
    TabsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    ToastModule,
    MatDialogModule,
  ],
  providers: [MessageService],
  templateUrl: './template-list.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './template-list.component.scss'
})
export class TemplateListComponent implements OnInit {
  @ViewChild('templateActionMenu') private templateActionMenu!: Menu;

  private messageService = inject(MessageService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  search = '';
  templates: TemplateCard[] = [];
  templatesLoading = true;
  templatesLoadError = '';
  templatesRefreshError = '';
  private hasCachedTemplates = false;
  templateMenuItems: MenuItem[] = [];
  activeTab: 'active' | 'archived' | 'assigned' = 'active';
  selectedTab = '0';
  assignedLoading = true;
  assignedLoadError = '';
  assignedRefreshError = '';
  hasCachedAssignments = false;
  embedded = input(false);
  createRequested = output<void>();

  assignedGroups: FormAssignmentGroup[] = [];

  constructor(
    private router: Router,
    private formsService: FormsService,
  ) {}

  ngOnInit(): void {
    this.restoreCachedTemplates();
    this.restoreCachedAssignments();

    const savedTab = sessionStorage.getItem('template_list_selected_tab');
    if (savedTab === '0' || savedTab === '1' || savedTab === '2') {
      this.selectedTab = savedTab;
      this.activeTab = savedTab === '1' ? 'archived' : savedTab === '2' ? 'assigned' : 'active';
    }

    this.loadTemplates();
    this.loadAssignedForms();
  }

  loadTemplates(): void {
    this.templatesLoading = !this.hasCachedTemplates;
    this.templatesLoadError = '';
    this.templatesRefreshError = '';

    this.formsService.getTemplates().pipe(
      timeout({ first: 15000 }),
      finalize(() => {
        this.templatesLoading = false;
      }),
    ).subscribe({
      next: (data: unknown) => {
        const mappedTemplates = this.mapTemplates(data);
        if (!mappedTemplates) {
          const errorMessage = 'The server returned an invalid questionnaire list.';
          if (this.hasCachedTemplates) {
            this.templatesRefreshError = errorMessage;
          } else {
            this.templatesLoadError = errorMessage;
          }
          return;
        }

        this.templates = mappedTemplates;
        this.hasCachedTemplates = true;
        const cacheKey = this.getTemplatesCacheKey();
        if (cacheKey) {
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
          } catch (error) {
            console.warn('Unable to cache questionnaires for the current session', error);
          }
        }
      },
      error: (error: unknown) => {
        console.error('Error fetching templates', error);
        const errorMessage = 'Unable to refresh questionnaires. Check your connection and retry.';
        if (this.hasCachedTemplates) {
          this.templatesRefreshError = errorMessage;
        } else {
          this.templatesLoadError = 'Unable to load questionnaires. Check your connection and retry.';
        }
        this.showNotification('error', 'Error loading templates');
      },
    });
  }

  private getTemplatesCacheKey(): string | null {
    const userId = this.authService.getPayload()?.sub;
    return userId ? `form_templates_cache_${userId}` : null;
  }

  private restoreCachedTemplates(): void {
    const cacheKey = this.getTemplatesCacheKey();
    if (!cacheKey) return;

    const cachedData = sessionStorage.getItem(cacheKey);
    if (!cachedData) return;

    try {
      const templates = this.mapTemplates(JSON.parse(cachedData));
      if (!templates) {
        throw new Error('Cached questionnaire list has an invalid format.');
      }

      this.templates = templates;
      this.hasCachedTemplates = true;
      this.templatesLoading = false;
    } catch (error) {
      console.warn('Unable to restore cached questionnaires', error);
      sessionStorage.removeItem(cacheKey);
    }
  }

  private mapTemplates(data: unknown): TemplateCard[] | null {
    if (!Array.isArray(data)) return null;

    return data.map((item: any) => {
      const template = item ?? {};
      const rawStatus = String(template.status || 'draft').toLowerCase();

      let statusLabel = 'Draft';
      if (rawStatus === 'published') statusLabel = 'Published';
      if (rawStatus === 'archived') statusLabel = 'Archived';

      return {
        id: String(template.id ?? ''),
        title: String(template.title ?? ''),
        description: template.description ?? '',
        category: template.category ?? 'General',
        status: rawStatus as TemplateCard['status'],
        statusLabel,
        Questions: template.questions?.length ?? template.Questions?.length ?? 0,
        responses: template.responses?.length ?? 0,
        createdBy: template.createdBy ?? template.created_by ?? 'System',
        updatedAt: new Date(template.updated_at ?? template.updatedAt),
      };
    });
  }

  private getAssignmentsCacheKey(): string | null {
    const userId = this.authService.getPayload()?.sub;
    return userId ? `form_assignments_cache_${userId}` : null;
  }

  private restoreCachedAssignments(): void {
    const cacheKey = this.getAssignmentsCacheKey();
    if (!cacheKey) return;

    const cachedData = sessionStorage.getItem(cacheKey);
    if (!cachedData) return;

    try {
      const groups = this.mapAssignments(JSON.parse(cachedData));
      if (!groups) {
        throw new Error('Cached assignment list has an invalid format.');
      }

      this.assignedGroups = groups;
      this.hasCachedAssignments = true;
      this.assignedLoading = false;
    } catch (error) {
      console.warn('Unable to restore cached form assignments', error);
      sessionStorage.removeItem(cacheKey);
    }
  }

  loadAssignedForms(): void {
    this.assignedLoading = !this.hasCachedAssignments;
    this.assignedLoadError = '';
    this.assignedRefreshError = '';

    this.formsService.getAssignments().pipe(
      timeout({ first: 15000 }),
      finalize(() => {
        this.assignedLoading = false;
      }),
    ).subscribe({
      next: (assignments: unknown) => {
        const groups = this.mapAssignments(assignments);
        if (!groups) {
          const errorMessage = 'The server returned an invalid assigned forms list.';
          if (this.hasCachedAssignments) {
            this.assignedRefreshError = errorMessage;
          } else {
            this.assignedLoadError = errorMessage;
          }
          return;
        }

        this.assignedGroups = groups;
        this.hasCachedAssignments = true;
        const cacheKey = this.getAssignmentsCacheKey();
        if (cacheKey) {
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(assignments));
          } catch (error) {
            console.warn('Unable to cache form assignments for the current session', error);
          }
        }
      },
      error: (error: unknown) => {
        console.error('Error fetching assignments', error);
        if (this.hasCachedAssignments) {
          this.assignedRefreshError = 'Unable to refresh assigned forms. Showing the last loaded list.';
        } else {
          this.assignedLoadError = 'Unable to load assigned forms. Check your connection and retry.';
        }
      },
    });
  }

  private mapAssignments(assignments: unknown): FormAssignmentGroup[] | null {
    if (!Array.isArray(assignments)) return null;

    const groupsMap = new Map<string, FormAssignmentGroup>();
    assignments.forEach((item: any) => {
      const assignment = item ?? {};
      const templateId = assignment.template_id ?? assignment.template?.id;
      if (typeof templateId !== 'string' || !templateId) return;

      const templateTitle = assignment.template?.title || 'Untitled Form';
      const category = assignment.template?.category || 'General';
      if (!groupsMap.has(templateId)) {
        groupsMap.set(templateId, {
          templateId,
          templateTitle,
          category,
          targetTypeLabel: assignment.target_type || 'All Users',
          totalAssigned: 0,
          completedCount: 0,
        });
      }

      const group = groupsMap.get(templateId)!;
      group.totalAssigned++;
      if (assignment.status?.toLowerCase() === 'completed') {
        group.completedCount++;
      }
    });

    if (assignments.length > 0 && groupsMap.size === 0) return null;

    return Array.from(groupsMap.values());
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

  onTabChange(value: string | number | undefined): void {
    if (value === undefined) return;
    const selectedTab = String(value);
    if (selectedTab !== '0' && selectedTab !== '1' && selectedTab !== '2') return;

    this.selectedTab = selectedTab;
    sessionStorage.setItem('template_list_selected_tab', selectedTab);

    if (this.selectedTab === '0') this.activeTab = 'active';
    else if (this.selectedTab === '1') this.activeTab = 'archived';
    else if (this.selectedTab === '2') {
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
          this.showNotification('warn', 'No assignments found for this form');
        }
      },
      error: (err: any) => {
        console.error('Error fetching form results', err);
        this.showNotification('error', 'Error loading form results');
      },
    });
  }

  createTemplate(): void {
    if (this.embedded()) {
      this.createRequested.emit();
      return;
    }

    void this.router.navigate(['/forms/builder', 'new']);
  }

  edit(template: TemplateCard): void {
    this.router.navigate(['/forms/builder', template.id]);
  }

  openTemplateMenu(event: Event, template: TemplateCard): void {
    this.templateMenuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        disabled: template.status === 'archived',
        command: () => this.edit(template),
      },
      {
        label: 'Duplicate',
        icon: 'pi pi-copy',
        command: () => this.duplicate(template),
      },
      ...(template.status === 'archived'
        ? [{
            label: 'Restore',
            icon: 'pi pi-replay',
            command: () => this.restore(template),
          }]
        : [{
            label: 'Archive',
            icon: 'pi pi-folder',
            command: () => this.archive(template),
          }]),
      { separator: true },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500',
        command: () => this.delete(template),
      },
    ];
    this.templateActionMenu.toggle(event);
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
        this.showNotification('error', 'Unable to identify the current user');
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
          this.showNotification('success', 'Form assigned successfully');
          this.loadAssignedForms();
        },
        error: (err: any) => {
          console.error('Error assigning form', err);
          this.showNotification('error', err.error?.message || 'Error assigning form');
        },
      });
    });
  }

  duplicate(template: TemplateCard): void {
    this.formsService.duplicateTemplate(template.id).subscribe({
      next: () => {
        this.showNotification('success', 'Template duplicated successfully');
        this.loadTemplates();
      },
      error: (err: any) => {
        console.error('Error duplicating template', err);
        this.showNotification('error', 'Error duplicating template');
      },
    });
  }

  archive(template: TemplateCard): void {
    template.status = 'archived';
    template.statusLabel = 'Archived';
    this.templates = [...this.templates];

    this.formsService.archiveTemplate(template.id).subscribe({
      next: () => {
        this.showNotification('success', 'Template archived');
        this.loadTemplates();
      },
      error: (err: any) => {
        console.error('Error archiving template', err);
        this.showNotification('error', 'Error archiving template');
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
        this.showNotification('success', 'Template restored');
        this.loadTemplates();
      },
      error: (err: any) => {
        console.error('Error restoring template', err);
        this.showNotification('error', 'Error restoring template');
        this.loadTemplates();
      },
    });
  }

  delete(template: TemplateCard): void {
    if (confirm(
      `Delete "${template.title}" permanently? This also deletes all assignments, responses, results, and sessions for this form.`,
    )) {
      this.templates = this.templates.filter((t) => t.id !== template.id);
      this.formsService.deleteTemplate(template.id).subscribe({
        next: () => {
          this.showNotification('success', 'Template deleted successfully');
          this.loadTemplates();
        },
        error: (err: any) => {
          console.error('Error deleting template', err);
          const message = err?.error?.message;
          this.showNotification(
            'error',
            Array.isArray(message)
              ? message.join(' ')
              : message ?? 'Error deleting template',
          );
          this.loadTemplates();
        },
      });
    }
  }

  private showNotification(severity: 'success' | 'error' | 'warn', detail: string): void {
    this.messageService.add({
      severity,
      summary: severity === 'error' ? 'Error' : 'Notification',
      detail,
      life: 3000,
    });
  }
}