# TemplateService — Étape 1 du moteur de formulaires

## Objectif

Ce document décrit l’implémentation du service de gestion des templates de formulaires pour Kehoros.

Le service couvre :
- création de formulaires
- consultation des formulaires
- modification de la configuration de base
- publication
- archivage
- duplication avec copie des Questions et options
- suppression

## Architecture cible

Le service s’appuie sur :
- FormTemplate : modèle principal du formulaire
- FormQuestion : Questions associées au template
- FormOption : options des Questions de type choix
- FormStatus : état du formulaire (draft, published, archived)

## Méthodes disponibles

### create(input)
Crée un nouveau template en mode brouillon.

Règles métier :
- le Title est obligatoire
- le Title doit contenir au moins 3 caractères
- la catégorie est obligatoire
- la catégorie doit contenir au moins 2 caractères
- la durée et le score de passage doivent être valides si fournis

### findAll()
Retourne tous les templates avec leurs Questions et options, triés par date de création décroissante.

### findOne(id)
Retourne un template avec ses Questions, options et affectations.

### update(id, input)
Met à jour les informations de base du template.

### publish(id)
Passe un template en statut published.

Règles métier :
- un template archivé ne peut pas être publié
- le Title et la catégorie doivent être renseignés

### archive(id)
Passe un template en statut archived.

### duplicate(id, overrides)
Crée une copie complète du template dans un nouveau brouillon.

Cette opération utilise une transaction TypeORM pour garantir :
- la création du nouveau template
- la copie de chaque Question
- la copie de chaque option associée

### remove(id)
Supprime le template après vérification de son existence.

## Bonnes pratiques appliquées

- injection des repositories via @InjectRepository
- utilisation d’exceptions NestJS adaptées : NotFoundException, BadRequestException, ConflictException
- normalisation des entrées avant validation
- logique de transaction pour la duplication
- séparation claire entre validation, récupération et persistence

## Intégration

Le service est déjà enregistré dans le module forms et prêt à être injecté dans un contrôleur ou dans un service orchestration.

## Exemple d’usage

```ts
const created = await templateService.create({
  title: 'Évaluation RH',
  category: 'RH',
  created_by: 'user-123',
});
```

## Étapes suivantes

Cette étape est la base du moteur de formulaires. Les prochaines étapes seront :
1. QuestionService
2. AssignmentService
3. ResponseService
4. ResultService
5. FormsService
6. FormsController
