# Moteur de Formulaires Kehoros — Architecture Complète

## Vue d'ensemble

Le moteur de formulaires est maintenant complet et structuré selon une architecture en couches :

- **Services métier** : logique des domaines (template, question, assignation, réponse, résultat)
- **Service d'orchestration** : coordonne les différents services
- **Contrôleur API** : expose les endpoints REST sécurisés par JWT
- **Module** : enregistre toutes les dépendances

## Services implémentés

### TemplateService
Gère la création et le cycle de vie des formulaires :
- create
- findAll / findOne
- update
- publish / archive
- duplicate
- remove

### QuestionService
Gère les questions et les options des formulaires :
- createQuestion / updateQuestion / removeQuestion
- findByTemplate / findOne
- createOption / updateOption / removeOption

### AssignmentService
Gère l'attribution des formulaires aux utilisateurs :
- assign
- findAll / findByUser / findByTemplate
- updateStatus / renew / cancel

### ResponseService
Gère le démarrage et la soumission des réponses :
- start
- saveDraft
- submit
- findByAssignment

### ResultService
Gère l'évaluation et les résultats :
- evaluate (automatique : calcul score/pourcentage)
- findByResponse
- updateStatus

### FormsService
Service d'orchestration qui expose toutes les opérations via des méthodes simples.

## Endpoints API

### Templates (sécurisés par JWT)
```
POST   /forms/templates                    - Créer
GET    /forms/templates                    - Lister
GET    /forms/templates/:id                - Détail
PATCH  /forms/templates/:id                - Modifier
POST   /forms/templates/:id/publish        - Publier
POST   /forms/templates/:id/archive        - Archiver
POST   /forms/templates/:id/duplicate      - Dupliquer
DELETE /forms/templates/:id                - Supprimer
```

### Questions (sécurisés par JWT)
```
POST   /forms/questions                    - Créer
GET    /forms/templates/:templateId/questions - Lister par template
GET    /forms/questions/:id                - Détail
PATCH  /forms/questions/:id                - Modifier
DELETE /forms/questions/:id                - Supprimer
```

### Options (sécurisés par JWT)
```
POST   /forms/options                      - Créer
PATCH  /forms/options/:id                  - Modifier
DELETE /forms/options/:id                  - Supprimer
```

### Assignations (sécurisés par JWT)
```
POST   /forms/assignments                  - Créer
GET    /forms/assignments?userId=...       - Lister par utilisateur
GET    /forms/assignments?templateId=...   - Lister par formulaire
PATCH  /forms/assignments/:id/status       - Changer le statut
```

### Réponses (partiellement sécurisé)
```
POST   /forms/responses/start              - Démarrer une réponse
POST   /forms/responses/draft              - Sauvegarder brouillon
POST   /forms/responses/submit             - Soumettre (sécurisé)
GET    /forms/responses/:assignmentId      - Récupérer réponses
```

### Résultats (sécurisés par JWT)
```
POST   /forms/results/:responseId/evaluate - Évaluer une réponse
GET    /forms/results/:responseId          - Récupérer résultats
```

## Flux de travail typique

1. **Création d'un formulaire** :
   ```
   POST /forms/templates
   ```

2. **Ajout de questions** :
   ```
   POST /forms/questions
   ```

3. **Ajout d'options** (pour radio/checkbox/select) :
   ```
   POST /forms/options
   ```

4. **Publication** :
   ```
   POST /forms/templates/:id/publish
   ```

5. **Attribution aux utilisateurs** :
   ```
   POST /forms/assignments
   ```

6. **Remplissage du formulaire** :
   ```
   POST /forms/responses/start
   POST /forms/responses/draft (plusieurs fois si nécessaire)
   POST /forms/responses/submit
   ```

7. **Évaluation** :
   ```
   POST /forms/results/:responseId/evaluate
   GET /forms/results/:responseId
   ```

## Statuts et états

### FormStatus
- DRAFT : brouillon, en édition
- PUBLISHED : publié, peut être assigné
- ARCHIVED : archivé, plus utilisable

### AssignmentStatus
- pending : en attente
- in_progress : en cours de remplissage
- completed : complété
- cancelled : annulé

### ResultStatus
- PENDING : en attente d'évaluation
- PASSED : réussi
- FAILED : échoué

## Sécurité

- Les endpoints de modification sont protégés par **JwtAuthGuard**
- Les endpoints de lecture sont accessibles publiquement (à adapter selon les besoins)
- Les repositories sont injectés via **@InjectRepository**
- Les erreurs sont gérées par les exceptions NestJS standard

## Intégration dans le projet

Le module FormsModule :
- Enregistre toutes les entités TypeORM
- Déclare tous les services et le contrôleur
- Exporte les services pour réutilisation dans d'autres modules

## Prochaines étapes recommandées

1. Ajouter des validations côté frontend
2. Créer le builder de formulaires Angular
3. Implémenter la sauvegarde automatique des brouillons
4. Ajouter l'export PDF/Excel
5. Implémenter l'historique et versioning
6. Ajouter le support QR codes et signatures
