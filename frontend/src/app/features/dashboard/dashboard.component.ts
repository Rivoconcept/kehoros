import { Component, OnInit, ChangeDetectionStrategy, signal, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NavbarDashboardComponent } from './navbar-dashboard/navbar-dashboard.component';
import type { CurrentUser } from './navbar-dashboard/navbar-dashboard.component';
import { SidebarModule } from 'primeng/sidebar';
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

  private routerSub?: any;
  private mql?: MediaQueryList;
  private mqlListener?: (e: MediaQueryListEvent) => void;

  ngOnInit() {
    // 1. Restauration prioritaire depuis sessionStorage (évite la perte au F5)
    const savedSection = sessionStorage.getItem('active_dashboard_section');
    if (savedSection) {
      this.activeSection.set(savedSection);
    }

    if (typeof window === 'undefined') return;

    // 2. Gestion de la taille d'écran (Media Query Mobile)
    this.mql = window.matchMedia('(max-width: 1023px)');
    this.isMobile.set(this.mql.matches);

    this.mqlListener = (e) => {
      this.isMobile.set(e.matches);
      if (e.matches) {
        this.open.set(false);
      }
    };
    this.mql.addEventListener('change', this.mqlListener);

    // 3. Écoute des changements de route pour synchronisation URL
    this.routerSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveSectionFromUrl(event.urlAfterRedirects);
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }

    if (this.mql && this.mqlListener) {
      this.mql.removeEventListener('change', this.mqlListener);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  toggleAccessories() {
    this.accessoriesOpen.update((v) => !v);
  }

  toggleAdapter() {
    this.adapterOpen.update((v) => !v);
  }

  // Méthode pour mapper une URL à une section active
  private updateActiveSectionFromUrl(url: string) {
    if (url.includes('/forms/templates')) {
      this.selectSection('Forms / Templates');
    } else if (url.includes('/dashboard')) {
      const savedSection = sessionStorage.getItem('active_dashboard_section');
      if (savedSection) {
        this.selectSection(savedSection);
      }
    }

  }

  selectSection(section: string) {
    this.activeSection.set(section);
    sessionStorage.setItem('active_dashboard_section', section);
    if (this.isMobile()) {
      this.open.set(false);
    }
  }
}