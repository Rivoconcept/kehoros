# GameHub - New Project Setup

Configuration clean et simple avec **Angular** (frontend) et **NestJS** (backend).

## Structure
```
NEW/
├── backend/          # NestJS backend
├── frontend/         # Angular frontend
├── secrets/          # Configuration files
├── docker-compose.yml
├── .env
└── Makefile
```

## Démarrage rapide

### 1. Lancer le projet
```bash
cd NEW
make up
```

### 2. Accéder aux services
- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:3000/api
- **Backend Health** : http://localhost:3000/api/health

### 3. Commandes utiles
```bash
make logs           # Voir tous les logs
make logs-backend   # Logs backend
make logs-frontend  # Logs frontend
make down           # Arrêter
make clean          # Supprimer containers et volumes
make build          # Rebuild images
```

## Architecture

### Backend (NestJS)
- Structure modulaire
- TypeORM pour la base de données
- CORS activé
- API REST ready
- PostgreSQL 16

### Frontend (Angular)
- Angular 17
- Standalone components
- Routing ready
- Development server with hot reload

### Base de données
- PostgreSQL 16
- Auto-création du schema
- Prête pour TypeORM

## Configuration

Les secrets se trouvent dans `secrets/init.json` :
- Identifiants PostgreSQL
- JWT secrets
- Variables d'environnement

Modifiez `.env` pour changer les ports et paths.

## Notes

- ✅ Sans Vault (simplifié)
- ✅ Sans WAF (configurable plus tard)
- ✅ Docker Compose simple et fonctionnel
- ✅ npm au lieu de pnpm (plus stable)
- ✅ Développement prêt à l'emploi
