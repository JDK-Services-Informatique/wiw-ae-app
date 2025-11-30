# 🚂 Déploiement Scallingo - Guide Rapide

## Déploiement en 5 minutes

### 1. Créer le projet Scallingo

1. Allez sur https://scallingo.app
2. Connectez-vous avec GitHub
3. Cliquez sur **"New Project"** > **"Deploy from GitHub repo"**
4. Sélectionnez `JDK-Services-Informatique/wiw-ae-app`

### 2. Ajouter PostgreSQL

1. Dans le projet, cliquez sur **"+ New"** > **"Database"** > **"Add PostgreSQL"**
2. Scallingo créera automatiquement la base de données

### 3. Déployer le Backend

1. **"+ New"** > **"GitHub Repo"** > Sélectionnez votre repo
2. **Settings** > **Root Directory** : `backend`
3. **Settings** > **Variables** :
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=[générer 32+ caractères aléatoires]
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=[à mettre après déploiement frontend]
   CORS_ORIGIN=[à mettre après déploiement frontend]
   ```
   - `DATABASE_URL` est automatiquement injectée
4. **Settings** > **Networking** > **"Generate Domain"**
5. Notez l'URL (ex: `wiw-ae-backend.up.scallingo.app`)

### 4. Déployer le Frontend

1. **"+ New"** > **"GitHub Repo"** > Sélectionnez votre repo
2. **Settings** > **Root Directory** : `frontend`
3. **Settings** > **Variables** :
   ```
   VITE_API_URL=https://wiw-ae-backend.up.scallingo.app/api
   NODE_ENV=production
   ```
4. **Settings** > **Networking** > **"Generate Domain"**
5. Notez l'URL (ex: `wiw-ae-frontend.up.scallingo.app`)

### 5. Finaliser la configuration

1. Retournez dans le service **Backend**
2. Mettez à jour les variables :
   ```
   FRONTEND_URL=https://wiw-ae-frontend.up.scallingo.app
   CORS_ORIGIN=https://wiw-ae-frontend.up.scallingo.app
   ```
3. Le backend redémarre automatiquement

## ✅ Vérification

- Backend : `https://wiw-ae-backend.up.scallingo.app/api/health`
- Frontend : `https://wiw-ae-frontend.up.scallingo.app`

## 📚 Documentation complète

Voir `DEPLOY_RAILWAY.md` pour le guide détaillé.

