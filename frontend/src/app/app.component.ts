import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div style="text-align: center; padding: 20px;">
      <h1>🎮 Welcome to GameHub</h1>
      <p>Frontend: Angular {{ angularVersion }}</p>
      <p>Backend: NestJS</p>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'gamehub-frontend';
  angularVersion = '17';
}
