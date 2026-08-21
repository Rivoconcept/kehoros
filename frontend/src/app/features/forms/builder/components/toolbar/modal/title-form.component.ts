import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-title-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './title-form.component.html',
  styleUrl: './title-form.component.scss'
})
export class TitleFormModalComponent {
  title: string = '';

  constructor(private dialogRef: MatDialogRef<TitleFormModalComponent>) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (this.title.trim()) {
      this.dialogRef.close(this.title.trim());
    }
  }
}