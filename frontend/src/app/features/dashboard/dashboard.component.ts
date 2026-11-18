import { Component, OnInit, ChangeDetectionStrategy, signal, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../core/services/auth.service';
import { NavbarDashboardComponent } from './navbar-dashboard/navbar-dashboard.component';
import type { CurrentUser } from './navbar-dashboard/navbar-dashboard.component';
import { SidebarModule } from 'primeng/sidebar';
import { Home } from '@primeicons/angular/home';
import { Database } from '@primeicons/angular/database';
import { Key } from '@primeicons/angular/key';
import { Server } from '@primeicons/angular/server';
import { Globe } from '@primeicons/angular/globe';
import { Code } from '@primeicons/angular/code';
import { Cog } from '@primeicons/angular/cog';
import { ExternalLink } from '@primeicons/angular/external-link';
import { NgClass } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TemplateListComponent } from '../forms/templates/template-list.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
interface NavMenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    SidebarModule,
    CardModule,
    NavbarDashboardComponent,
    DashboardContentComponent,
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DashboardComponent implements OnInit, OnDestroy {
  menuItems: NavMenuItem[] = [
    { icon: 'pi-chart-bar', label: 'Tableau de bord', route: '/dashboard' },
    { icon: 'pi-file-edit', label: 'Formulaires',     route: '/forms/templates' },
    { icon: 'pi-desktop',   label: 'Matériels',       route: '/assets' },
    { icon: 'pi-users',     label: 'Collaborateurs',  route: '/collaborators' },
    { icon: 'pi-user',      label: 'Utilisateurs',    route: '/users' },
    { icon: 'pi-key',       label: 'Licences',        route: '/licenses' },
  ];



  constructor(private router: Router, private authService: AuthService) {}

  currentUser = computed<CurrentUser>(() => {
    const payload = this.authService.getPayload();
    const email = payload?.email ?? '';
    const name = email.split('@')[0] || 'Utilisateur';
    const role = this.authService.currentRole();
    const roleLabels: Record<string, string> = {
      admin: 'Administrator',
      manager: 'Gestionnaire',
      user: 'Utilisateur',
    };
    const initials =
      name
        .split(/[.\s_-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('') || 'U';

    return {
      name,
      email,
      role: roleLabels[role] ?? role,
      initials,
    };
  });

  isMobile = signal(false);
  open = signal(false);
  activeSection = signal<string>('Tableau de bord');
  accessoriesOpen = signal(false);
  adapterOpen = signal(false);

  private mql?: MediaQueryList;
  private mqlListener?: (e: MediaQueryListEvent) => void;

  ngOnInit() {
    if (typeof window === 'undefined') return;
    this.mql = window.matchMedia('(max-width: 1023px)');
    this.isMobile.set(this.mql.matches);

    this.mqlListener = (e) => {
      this.isMobile.set(e.matches);
      if (e.matches) {
        this.open.set(false);
      }
    };
    this.mql.addEventListener('change', this.mqlListener);
  }

  ngOnDestroy() {
    if (this.mql && this.mqlListener) {
      this.mql.removeEventListener('change', this.mqlListener);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  selectSection(section: string) {
    this.activeSection.set(section);
    if (this.isMobile()) {
      this.open.set(false);
    }
  }

  toggleAccessories() {
    this.accessoriesOpen.update((v) => !v);
  }

  toggleAdapter() {
    this.adapterOpen.update((v) => !v);
  }
}