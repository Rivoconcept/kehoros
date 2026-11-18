import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { finalize, timeout } from 'rxjs';
import { Collaborator } from '../models/collaborator.model';
import { CollaboratorsService } from '../services/collaborators.service';

@Component({
  standalone: true,
  imports: [CommonModule, InputTextModule, TableModule],
  selector: 'app-collaborators-list',
  styleUrl: './collaborators-list.component.scss',
  templateUrl: './collaborators-list.component.html',
})
export class CollaboratorsListComponent implements OnInit {
  collaborators = signal<Collaborator[]>([]);
  loading = signal(false);
  error = signal('');
  search = signal('');

  filteredCollaborators = computed(() => {
    const query = this.search().trim().toLocaleLowerCase();
    if (!query) return this.collaborators();

    return this.collaborators().filter((collaborator) =>
      [
        collaborator.matricule,
        collaborator.nom,
        collaborator.prenoms,
        collaborator.email,
        collaborator.fonction,
        collaborator.departement,
        collaborator.pole,
        collaborator.equipeFr,
      ].some((value) => value?.toLocaleLowerCase().includes(query)),
    );
  });

  constructor(private collaboratorsService: CollaboratorsService) {}

  ngOnInit(): void {
    this.loadCollaborators();
  }

  loadCollaborators(): void {
    this.loading.set(true);
    this.error.set('');

    this.collaboratorsService.getAll().pipe(
      timeout({ first: 15000 }),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (collaborators) => this.collaborators.set(collaborators),
      error: (error: unknown) => this.error.set(this.getErrorMessage(error)),
    });
  }

  setSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  getFullName(collaborator: Collaborator): string {
    return [collaborator.prenoms, collaborator.nom].filter(Boolean).join(' ');
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;
      if (Array.isArray(message)) return message.join(' ');
      if (typeof message === 'string') return message;
    }

    if (error instanceof Error && error.name === 'TimeoutError') {
      return 'Le chargement des collaborateurs a dépassé le délai. Réessayez.';
    }

    return 'Impossible de charger les collaborateurs. Réessayez.';
  }
}
