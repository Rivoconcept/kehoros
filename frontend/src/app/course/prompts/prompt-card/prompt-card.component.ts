import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Prompt } from '../prompt.model';
import { ButtonDirective } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
    selector: 'app-prompt-card',
    imports: [ButtonDirective, Textarea, TagModule, CardModule, IconFieldModule, InputIconModule],
    templateUrl: './prompt-card.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './prompt-card.component.scss'
})
export class PromptCardComponent {

  prompt = input.required<Prompt>();
  
  copyToClipBoard() {
    void navigator.clipboard.writeText(this.prompt().content)
  }
}
