import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuilderService } from '../../services/builder.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  constructor(
    public builder: BuilderService
  ) {}

  save() {

    const template = this.builder.template;

    if (!template) return;

    this.builder.save(template);

    console.log('Template sauvegardé');

  }

}