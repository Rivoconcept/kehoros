import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';

import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';

@Component({
    selector: 'app-users-list',
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
    ],
    templateUrl: './users-list.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {

  displayedColumns = ['name', 'email', 'role', 'status', 'created', 'actions'];
  users: User[] = [];
  loading = false;
  recoveryCode = '';
  recoveryCodeUser = '';
  recoveryCodeCopied = false;
  recoveryCodeError = '';
  recoveryCodeRequestError = '';
  passwordUserId = '';
  passwordUserName = '';
  newPassword = '';
  confirmPassword = '';
  passwordLoading = false;
  passwordError = '';
  passwordSuccess = '';
  showNewPassword = false;
  showConfirmPassword = false;
  twoFactorUpdatingIds = new Set<string>();
  twoFactorBulkLoading = false;
  twoFactorError = '';

  constructor(
    private usersService: UsersService,
    private clipboard: Clipboard,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.usersService.getAll().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  changeRole(user: User, role: string) {
    this.usersService.updateRole(user.id, role).subscribe(() => {
      user.role = role as any;
    });
  }

  toggleStatus(user: User) {
    this.usersService.updateStatus(user.id, !user.is_active).subscribe(() => {
      user.is_active = !user.is_active;
    });
  }

  get allTwoFactorEnabled(): boolean {
    return this.users.length > 0 && this.users.every(user => user.two_factor_enabled);
  }

  toggleUserTwoFactor(user: User): void {
    if (this.twoFactorUpdatingIds.has(user.id)) return;
    const enabled = !user.two_factor_enabled;
    this.twoFactorError = '';
    this.twoFactorUpdatingIds.add(user.id);
    this.usersService.updateTwoFactor(user.id, enabled).subscribe({
      next: ({ enabled: saved }) => {
        user.two_factor_enabled = saved;
        this.twoFactorUpdatingIds.delete(user.id);
      },
      error: (err) => {
        this.twoFactorError = this.getRequestError(err, 'Impossible de modifier la double authentification.');
        this.twoFactorUpdatingIds.delete(user.id);
      },
    });
  }

  toggleAllTwoFactor(): void {
    if (this.twoFactorBulkLoading || !this.users.length) return;
    const enabled = !this.allTwoFactorEnabled;
    const action = enabled ? 'activer' : 'désactiver';
    const warning = enabled
      ? ''
      : '\n\nLa désactivation réduit la sécurité des connexions.';
    if (!confirm(`Voulez-vous ${action} la double authentification pour les ${this.users.length} comptes ?${warning}`)) {
      return;
    }

    this.twoFactorError = '';
    this.twoFactorBulkLoading = true;
    this.usersService.updateAllTwoFactor(enabled).subscribe({
      next: ({ enabled: saved }) => {
        this.users = this.users.map(user => ({ ...user, two_factor_enabled: saved }));
        this.twoFactorBulkLoading = false;
      },
      error: (err) => {
        this.twoFactorError = this.getRequestError(err, 'Impossible de modifier la double authentification des comptes.');
        this.twoFactorBulkLoading = false;
      },
    });
  }

  generateRecoveryCode(user: User) {
    if (!confirm(`Générer un nouveau code de secours pour ${user.first_name} ${user.last_name} ? L'ancien code sera invalidé.`)) {
      return;
    }

    this.recoveryCodeRequestError = '';
    this.usersService.generateRecoveryCode(user.id).subscribe({
      next: ({ code }) => {
        this.recoveryCode = code;
        this.recoveryCodeUser = `${user.first_name} ${user.last_name}`;
        this.recoveryCodeCopied = false;
        this.recoveryCodeError = '';
      },
      error: (err) => {
        const message = err?.error?.message;
        this.recoveryCodeRequestError = Array.isArray(message)
          ? message.join(' ')
          : message ?? 'Impossible de générer le code de secours.';
      },
    });
  }

  copyRecoveryCode(): void {
    if (!this.recoveryCode) return;

    this.recoveryCodeCopied = this.clipboard.copy(this.recoveryCode);
    this.recoveryCodeError = this.recoveryCodeCopied
      ? ''
      : 'La copie automatique a échoué. Sélectionnez le code puis copiez-le manuellement.';
  }

  closeRecoveryCode(): void {
    this.recoveryCode = '';
    this.recoveryCodeUser = '';
    this.recoveryCodeCopied = false;
    this.recoveryCodeError = '';
  }

  openPasswordDialog(user: User): void {
    this.passwordUserId = user.id;
    this.passwordUserName = `${user.first_name} ${user.last_name}`;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordLoading = false;
    this.passwordError = '';
    this.passwordSuccess = '';
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  changeUserPassword(): void {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (this.newPassword.length < 6 || this.newPassword.length > 128) {
      this.passwordError = 'Le mot de passe doit contenir entre 6 et 128 caractères.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.passwordLoading = true;
    this.usersService.changePassword(this.passwordUserId, this.newPassword).subscribe({
      next: () => {
        this.passwordLoading = false;
        this.passwordSuccess = 'Le mot de passe a été modifié.';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        const message = err?.error?.message;
        this.passwordError = Array.isArray(message)
          ? message.join(' ')
          : message ?? 'Impossible de modifier le mot de passe.';
        this.passwordLoading = false;
      },
    });
  }

  closePasswordDialog(): void {
    if (this.passwordLoading) return;
    this.passwordUserId = '';
    this.passwordUserName = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  deleteUser(user: User) {
    if (!confirm(`Delete ${user.first_name} ${user.last_name} ?`)) return;
    this.usersService.delete(user.id).subscribe(() => {
      this.users = this.users.filter(u => u.id !== user.id);
    });
  }

  private getRequestError(err: any, fallback: string): string {
    const message = err?.error?.message;
    return Array.isArray(message) ? message.join(' ') : message ?? fallback;
  }
}