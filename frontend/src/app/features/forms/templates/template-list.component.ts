import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';


interface TemplateCard {
  id: string;
  title: string;
  description: string;
  category: string;
  published: boolean;
  Questions: number;
  responses: number;
  createdBy: {
    id: string;
    name: string;
    };
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
    ],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.scss',
})
export class TemplateListComponent {

  constructor(private router: Router) {}

  search = '';

  templates: TemplateCard[] = [
    {
        id: '1',
        title: 'Test de compétence en Français',
        description: 'Évaluation du niveau linguistique',

        category: 'Formation',

        published: true,

        Questions: 24,

        responses: 17,

        createdBy: {
            id: '1',
            name: 'Administrateur',
        },

        updatedAt: new Date(),
    },
    {
        id: '2',
        title: 'Questionnaire RH',
        description: 'Collecte d’informations RH',
        category: 'RH',
        published: false,
        Questions: 15,
        responses: 0,
        createdBy: {
            id: '2',
            name: 'Administrateur',
        },
        updatedAt: new Date(),
    },
  ];

  get filteredTemplates() {
    return this.templates.filter(t =>
      t.title.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  createTemplate() {
    this.router.navigate(['/forms/builder']);
  }

  edit(template: TemplateCard) {
    this.router.navigate(['/forms/builder', template.id]);
  }

  duplicate(template: TemplateCard) {
    console.log('duplicate', template);
  }

  archive(template: TemplateCard) {
    console.log('archive', template);
  }

  delete(template: TemplateCard) {
    console.log('delete', template);
  }

}