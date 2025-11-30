# 🚀 Guide de démarrage local

## Prérequis

- Node.js 18+ installé
- npm ou yarn
- PostgreSQL (ou SQLite pour le développement)
- Git

## 📋 Installation

### 1. Cloner le projet (si nécessaire)
```bash
git clone <repository-url>
cd wiw-ae-app
```

### 2. Installer les dépendances

**Backend :**
```bash
cd backend
npm install
```

**Frontend :**
```bash
cd frontend
npm install
```

## 🔧 Configuration

### Backend - Variables d'environnement

Créer un fichier `backend/.env` (copier depuis `backend/env.example`) :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/wiw_db"
# Ou pour SQLite (développement) :
# DATABASE_URL="file:./prisma/dev.db"

# JWT
JWT_SECRET="votre-secret-jwt-minimum-32-caracteres-longueur-requise"
JWT_EXPIRES_IN="7d"

# Serveur
PORT=4000
NODE_ENV=development
HOST=0.0.0.0

# CORS
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

### Frontend - Variables d'environnement

Créer un fichier `frontend/.env` (copier depuis `frontend/env.example`) :

```env
VITE_API_URL=http://localhost:4000/api
```

## 🗄️ Base de données

### Option 1 : PostgreSQL (recommandé)

1. Installer PostgreSQL
2. Créer une base de données :
```sql
CREATE DATABASE wiw_db;
```

3. Mettre à jour `DATABASE_URL` dans `backend/.env`

### Option 2 : SQLite (développement rapide)

Utiliser SQLite pour le développement local :

```env
DATABASE_URL="file:./prisma/dev.db"
```

## 🔨 Setup de la base de données

```bash
cd backend

# Générer le client Prisma
npm run db:generate

# Créer les migrations
npm run db:migrate

# (Optionnel) Remplir avec des données de test
npm run db:seed
```

## ▶️ Démarrer l'application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Le backend devrait démarrer sur `http://localhost:4000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Le frontend devrait démarrer sur `http://localhost:5173`

## ✅ Vérification

### Backend
- Ouvrir `http://localhost:4000/api/health`
- Devrait retourner `{ "status": "ok" }`

### Frontend
- Ouvrir `http://localhost:5173`
- Devrait afficher la page d'accueil

## 🐛 Dépannage

### Erreur : "Cannot find module"
```bash
# Réinstaller les dépendances
cd backend && npm install
cd ../frontend && npm install
```

### Erreur : "Prisma Client not generated"
```bash
cd backend
npm run db:generate
```

### Erreur : "Database connection failed"
- Vérifier que PostgreSQL est démarré
- Vérifier `DATABASE_URL` dans `backend/.env`
- Vérifier les credentials

### Erreur : "Port already in use"
- Changer le port dans `backend/.env` (PORT=4001)
- Ou tuer le processus utilisant le port :
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4000 | xargs kill
```

### Erreur : "JWT_SECRET too short"
- Générer un secret de 32+ caractères :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📝 Scripts utiles

### Backend
- `npm run dev` - Démarrer en mode développement
- `npm start` - Démarrer en mode production
- `npm run db:generate` - Générer Prisma Client
- `npm run db:migrate` - Créer/appliquer migrations
- `npm run db:push` - Pousser le schéma vers la DB
- `npm run db:seed` - Remplir avec données de test
- `npm test` - Lancer les tests

### Frontend
- `npm run dev` - Démarrer en mode développement
- `npm run build` - Build pour production
- `npm run preview` - Prévisualiser le build
- `npm test` - Lancer les tests

## 🔍 Vérification complète

### Checklist avant déploiement

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Connexion à la base de données OK
- [ ] API `/api/health` répond
- [ ] Frontend peut se connecter au backend
- [ ] Pas d'erreurs dans la console
- [ ] Les routes principales fonctionnent
- [ ] Les variables d'environnement sont correctes

## 🚀 Prochaines étapes

Une fois que tout fonctionne en local :
1. Vérifier les logs pour les erreurs
2. Tester les fonctionnalités principales
3. Vérifier que les builds fonctionnent (`npm run build`)
4. Déployer sur Scallingo

