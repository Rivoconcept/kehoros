import { Component, ElementRef, HostListener, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { Popover, PopoverModule } from 'primeng/popover';

import { Search } from '@primeicons/angular/search';

export interface CurrentUser {
  name: string;
  email: string;
  role: string;
  initials: string;
}

@Component({
  imports: [Popover, PopoverModule, ButtonModule, AvatarModule, ToolbarModule, Search],
  selector: 'app-navbar-dashboard',
  styleUrl: './navbar-dashboard.component.scss',
  templateUrl: './navbar-dashboard.component.html',
})
export class NavbarDashboardComponent {

  constructor(private elementRef: ElementRef<HTMLElement>) {}
  
  isDark = signal(false)

  toggleDarkMode() {
    this.isDark.update(value => !value)
    document.documentElement.classList.toggle('app-dark', this.isDark())
  }

  activeSection = input<string>('Tableau de bord');
  user = input<CurrentUser>({
    name: 'Utilisateur',
    email: '',
    role: '',
    initials: 'U'
  });

  logout = output<void>();
  toggleSidebar = output<void>();

  dropdownOpen = signal(false);


  toggleDropdown(): void {
    this.dropdownOpen.update((isOpen) => !isOpen);
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent): void {
    if (!event.composedPath().includes(this.elementRef.nativeElement)) {
      this.dropdownOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  closeDropdownOnEscape(): void {
    this.dropdownOpen.set(false);
  }

  onLogout(): void {
    this.dropdownOpen.set(false);
    this.logout.emit();
  }
}
