import { Component, input } from '@angular/core';
import { Prompt } from '../prompt.model';

@Component({
  selector: 'app-prompt-card',
  standalone: true,
  imports: [],
  templateUrl: './prompt-card.component.html',
  styleUrl: './prompt-card.component.scss'
})
export class PromptCardComponent {

  prompt = input.required<Prompt>();
  
  copyToClipBoard() {
    void navigator.clipboard.writeText(this.prompt().content)
  }
}
