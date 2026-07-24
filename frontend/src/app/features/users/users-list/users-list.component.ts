import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {

  displayedColumns = ['name', 'email', 'role', 'status', 'created', 'actions'];
  users: User[] = [];
  loading = false;

  constructor(private usersService: UsersService) {}

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

  deleteUser(user: User) {
    if (!confirm(`Supprimer ${user.first_name} ${user.last_name} ?`)) return;
    this.usersService.delete(user.id).subscribe(() => {
      this.users = this.users.filter(u => u.id !== user.id);
    });
  }
}