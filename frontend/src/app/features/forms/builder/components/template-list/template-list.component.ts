import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface FormMasterGroup {
  template_id: string;
  template_title: string;
  target_type_label: string;
  total_assigned: number;
  completed_count: number;
  assignments: Array<{
    id: string;
    assignedToName: string;
    status: string;
    completedAt?: Date;
  }>;
}

@Component({
  selector: 'app-assignments-list',
  templateUrl: './assignments-list.component.html',
  styleUrls: ['./assignments-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AssignmentsListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'targetType', 'progress', 'actions'];
  expandedElement: FormMasterGroup | null = null;
  dataSource: FormMasterGroup[] = [];

  ngOnInit(): void {
    this.loadGroupedAssignments();
  }

  loadGroupedAssignments(): void {
    // Transformer le résultat plat du backend en liste regroupée par formulaire
    // Exemple de donnée groupée :
    this.dataSource = [
      {
        template_id: '1',
        template_title: 'Inventaire',
        target_type_label: 'All Users',
        total_assigned: 3,
        completed_count: 1,
        assignments: [
          { id: 'a1', assignedToName: 'user collab', status: 'pending' },
          { id: 'a2', assignedToName: 'Tiana Gerant', status: 'pending' },
          { id: 'a3', assignedToName: 'Rivo HANITRARIVELO', status: 'completed' },
        ],
      },
      {
        template_id: '2',
        template_title: 'Test',
        target_type_label: 'Users',
        total_assigned: 1,
        completed_count: 0,
        assignments: [
          { id: 'a4', assignedToName: 'Rivo HANITRARIVELO', status: 'pending' },
        ],
      },
    ];
  }

  toggleRow(element: FormMasterGroup): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }
}