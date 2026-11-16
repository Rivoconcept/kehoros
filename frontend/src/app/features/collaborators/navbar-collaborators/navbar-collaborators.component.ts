import { Component, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Search } from '@primeicons/angular/search';

@Component({
  standalone: true,
  imports: [AvatarModule, ToolbarModule, ButtonModule, Search],
  selector: 'app-navbar-collaborators',
  styleUrl: './navbar-collaborators.component.scss',
  templateUrl: './navbar-collaborators.component.html',
})
export class NavbarCollaboratorsComponent {
    isDark = signal(false)

    toggleDarkMode() {
      this.isDark.update(value => !value)
      document.documentElement.classList.toggle('app-dark', this.isDark())
    }
}
