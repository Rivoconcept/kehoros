import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-forms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem">
      <h2>Mes formulaires</h2>
      <p>Liste des formulaires à remplir — à venir</p>
    </div>
  `,
})
export class MyFormsComponent {}