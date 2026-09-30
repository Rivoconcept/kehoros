import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

export interface AssignedUser {
  id: string;
  name: string;
  email: string;
  status: 'PENDING' | 'COMPLETED';
  assignedAt: Date;
}

export interface FormAssignmentGroup {
  templateId: string;
  templateTitle: string;
  category: string;
  totalAssigned: number;
  completedCount: number;
  assignedUsers: AssignedUser[];
}

@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AssignmentListComponent implements OnInit {
  columnsToDisplay = ['templateTitle', 'category', 'progress', 'actions'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  
  dataSource: FormAssignmentGroup[] = [];
  expandedElement: FormAssignmentGroup | null = null;

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    // Exemple de données regroupées par questionnaire
    this.dataSource = [
      {
        templateId: '1',
        templateTitle: 'Onboarding Security Survey',
        category: 'Security',
        totalAssigned: 3,
        completedCount: 2,
        assignedUsers: [
          { id: 'u1', name: 'Jean Dupont', email: 'jean@company.com', status: 'COMPLETED', assignedAt: new Date() },
          { id: 'u2', name: 'Marie Curie', email: 'marie@company.com', status: 'COMPLETED', assignedAt: new Date() },
          { id: 'u3', name: 'Paul Martin', email: 'paul@company.com', status: 'PENDING', assignedAt: new Date() }
        ]
      }
    ];
  }

  toggleRow(element: FormAssignmentGroup): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }
}