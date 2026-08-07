import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";


import { QuestionPaletteComponent } from "../question-palette/question-palette.component";

import { QuestionType } from "../../../models/question-type.enum";
import { BuilderService } from "../../services/builder.service";

@Component({
  selector: "app-toolbar",

  standalone: true,

  imports: [CommonModule, MatIconModule, QuestionPaletteComponent],

  templateUrl: "./toolbar.component.html",

  styleUrl: "./toolbar.component.scss",
})
export class ToolbarComponent {
  showFieldMenu = false;

  constructor(public builder: BuilderService) {}

  toggleFieldMenu(): void {
    this.showFieldMenu = !this.showFieldMenu;
  }

  closeFieldMenu(): void {
    this.showFieldMenu = false;
  }

  addQuestion(type: QuestionType): void {
    this.builder.addQuestion(type);

    this.showFieldMenu = false;
  }

  save(): void {
    const template = this.builder.template;

    if (!template) return;

    this.builder.save(template);

    console.log("Template saved");
  }

  export(): void {
    this.builder.exportTemplate();
  }

  import(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) return;

    this.builder.importTemplate(file);

    input.value = "";
  }

  newTemplate(): void {
    const title = prompt("Nom du questionnaire");

    if (!title) return;

    this.builder.createTemplate({
      title: title.trim(),

      description: "",

      category: "general",
    });
  }
}
