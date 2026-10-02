import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { QuestionPreviewComponent } from '../builder/components/preview/question-preview/question-preview.component';
import { TemplateService } from '../services/template.service';
import { FormsService } from '../services/forms.services';
import { Template } from '../models/template.model';

@Component({
  selector: 'app-form-player',
  standalone: true,
  imports: [
    CommonModule,
    QuestionPreviewComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './form-player.component.html',
  styleUrl: './form-player.component.scss',
})
export class FormPlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private templateService = inject(TemplateService);
  private formsService = inject(FormsService);
  private snackBar = inject(MatSnackBar);

  template?: Template;
  assignmentId: string | null = null;
  loading = true;
  submitting = false;
  error = '';
  submitted = false;

  // Stocke les réponses saisies { question_id: answer_value }
  userAnswers: Record<string, any> = {};

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.assignmentId = this.route.snapshot.queryParamMap.get('assignment_id');

    if (!id) {
      this.error = 'Formulaire introuvable';
      this.loading = false;
      return;
    }

    this.templateService.findOne(id).subscribe({
      next: (template) => {
        this.template = template;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Impossible de charger le formulaire';
        this.loading = false;
      },
    });
  }

  /**
   * Capturera les réponses transmises par QuestionPreviewComponent
   */
  onAnswersChanged(answers: Record<string, any>): void {
    this.userAnswers = answers;
  }

  submitForm(): void {
    if (!this.template || this.submitting) return;

    this.submitting = true;

    const payload = {
      template_id: this.template.id,
      assignment_id: this.assignmentId ?? undefined,
      answers: this.userAnswers,
    };

    // Soumission de la réponse via le service d'API
    this.formsService.submitResponse(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
        this.snackBar.open('Formulaire soumis avec succès !', 'Fermer', { duration: 4000 });
      },
      error: (err: any) => {
        console.error('Erreur de soumission:', err);
        this.submitting = false;
        this.snackBar.open('Échec de la soumission du formulaire.', 'Fermer', { duration: 3000 });
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/forms/templates']);
  }
}