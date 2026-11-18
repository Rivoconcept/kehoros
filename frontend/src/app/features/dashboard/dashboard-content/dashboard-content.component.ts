import { Component, input, output } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TemplateListComponent } from '../../forms/templates/template-list.component';
import { UsersListComponent } from '../../users/users-list/users-list.component';
import { BuilderComponent } from '../../forms/builder/components/builder.component';
import { CollaboratorsListComponent } from '../../collaborators/collaborators-list/collaborators-list.component';

export interface StatCardItem {
  icon: string;
  label: string;
  value: number;
  color: string;
}

export const INITIAL_STATS: StatCardItem[] = [
  { icon: 'pi-desktop',  label: 'Matériels',          value: 0, color: '#4299e1' },
  { icon: 'pi-users',    label: 'Collaborateurs',     value: 0, color: '#48bb78' },
  { icon: 'pi-key',      label: 'Licences actives',   value: 0, color: '#ed8936' },
  { icon: 'pi-file',     label: 'Formulaires publiés', value: 0, color: '#9f7aea' },
];

@Component({
  selector: 'app-dashboard-content',
  styleUrl: './dashboard-content.component.scss',
  templateUrl: './dashboard-content.component.html',
  imports: [
    CommonModule,
    NgClass,
    CardModule,
    TemplateListComponent,
    UsersListComponent,
    BuilderComponent,
    CollaboratorsListComponent,
],
})
export class DashboardContentComponent {
  activeSection = input.required<string>();
  sectionSelected = output<string>();

  stats = input<StatCardItem[]>(INITIAL_STATS);
}