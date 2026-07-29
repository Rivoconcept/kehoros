import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Question } from '../../../models/question.model';


@Component({

  selector: 'app-preview-renderer',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './preview-renderer.component.html',

  styleUrl: './preview-renderer.component.scss'

})
export class PreviewRendererComponent {


  @Input()
  Question!: Question;


}