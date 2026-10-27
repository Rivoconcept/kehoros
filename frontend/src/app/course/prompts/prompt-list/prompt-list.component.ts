import { Component } from '@angular/core';
import { Prompt } from '../prompt.model';
import { PromptCardComponent } from '../prompt-card/prompt-card.component';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [PromptCardComponent],
  templateUrl: './prompt-list.component.html',
  styleUrl: './prompt-list.component.scss'
})
export class PromptListComponent {

  prompts: Prompt[]  = [
    {
      "id": 2,
      "title": "Post LinkedIn engageant",
      "content": "Ecris un Post LinkedIn court (150-200 mots) qui :\n\n- commence par une accroche question ou chiffre\n- partage une idée concrète ou une leçon apprise\n- se termine par un call-to-action (qquestion ou invitation à commenter)\n\nTon professionnel mais humain.",
      "score": 0,
      "createdAt": '2025-01-20T14:30:00.000Z',
      "category": {
        "id": 2,
        "name": "Posts LinkedIn"
      },
      "author": {
        "id": 2,
        "username": "Alice"
      },
      "userVote": null
    },
    {
      "id": 3,
      "title": "Article de bloc SEO",
      "content": "Rédige une introduction d'article de bloc (2-3 paragraphes) optimisée SEO :\n\n- inclure le mot-clé principal dans le premier paragraphe\n- poser le problème du lecteur\n- annoncer ce que l'article va apporter\n\nTon clair et direct.",
      "score": 0,
      "createdAt": '2025-01-20T15:15:00.000Z',
      "category": {
        "id": 3,
        "name": "Rédaction"
      },
      "author": {
        "id": 2,
        "username": "Alice"
      },
      "userVote": null
    },
    {
      "id": 4,
      "title": "Prompt pour image IA stylée",
      "content": "Crée une image avec :\n\n- un sujet principal bien défini\n- un style artistique cohérent (ex. aquarelle, pixel art, photogéoliste)\n- une composition équilibrée\n- des couleurs hamonieuses\n\nEviter le teste dans l'image.",
      "score": 0,
      "createdAt": '2025-01-20T11:45:00.000Z',
      "category": {
        "id": 1,
        "name": "Génération d'image"
      },
      "author": {
        "id": 3,
        "username": "Bob"
      },
      "userVote": null
    },
    {
      "id": 5,
      "title": "Commentaire de code expliqué",
      "content": "Génère un court commentaire (1-2 linges) en anglais pour une fonction: \n\n- décrire l'intention (what/why), pas le détail d'implémentation\n- style JSDoc ou docstring selon la langue.",
      "score": 0,
      "createdAt": '2025-01-20T08:45:00.000Z',
      "category": {
        "id": 4,
        "name": "Code"
      },
      "author": {
        "id": 3,
        "username": "Bob"
      },
      "userVote": null
    },
  ]
    
  

}
