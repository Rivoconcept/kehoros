import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Enum pour éviter l'erreur TS2304
export enum AssignmentTargetType {
  ALL = 'ALL',
  USERS = 'USERS',
  DEPARTMENT = 'DEPARTMENT'
}

@Component({
  selector: 'app-assign-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,      // Nécessaire pour [formGroup]
    MatDialogModule,         // Nécessaire pour mat-dialog-content
    MatFormFieldModule,      // Nécessaire pour mat-form-field & mat-label
    MatInputModule,          // Nécessaire pour matInput
    MatSelectModule,         // Nécessaire pour mat-select & mat-option
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './assign-form-dialog.component.html',
  styleUrl: './assign-form-dialog.component.scss',
})
export class AssignFormDialogComponent implements OnInit {
  assignForm!: FormGroup;
  shareableLink: string;

  targetTypes = [
    { value: AssignmentTargetType.ALL, label: 'All Users' },
    { value: AssignmentTargetType.USERS, label: 'Specific Users' },
    { value: AssignmentTargetType.DEPARTMENT, label: 'Department' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssignFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { templateId: string; templateTitle: string; employees?: any[] }
  ) {
    this.shareableLink = `${window.location.origin}/forms/player/${data.templateId}`;
  }

  copyLink(): void {
    void navigator.clipboard.writeText(this.shareableLink);
  }

  ngOnInit(): void {
    this.assignForm = this.fb.group({
      target_type: [AssignmentTargetType.ALL, Validators.required],
      user_ids: [[]],
    });
  }

  onSubmit(): void {
    if (this.assignForm.valid) {
      this.dialogRef.close(this.assignForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}