import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet],
    template: `
    <router-outlet></router-outlet>
  `,
    changeDetection: ChangeDetectionStrategy.Default,
    styles: []
})
export class AppComponent {
  title = 'Kehoros-frontend';
  angularVersion = '17';
}
