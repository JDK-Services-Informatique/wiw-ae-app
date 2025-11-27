# 🚂 Guide de déploiement WIW-AE+ sur Railway

## 📋 Prérequis

- Compte Railway (https://railway.app)
- Repository GitHub avec le code source
- PostgreSQL (fourni par Railway)

## 🚀 Méthode 1 : Déploiement automatique (Recommandé)

### Étape 1 : Créer un nouveau projet Railway

1. **Aller sur Railway Dashboard**
   - https://railway.app
   - Connectez-vous avec GitHub

2. **Créer un nouveau projet**
   - Cliquez sur **"New Project"**
   - Sélectionnez **"Deploy from GitHub repo"**
   - Choisissez votre repository : `JDK-Services-Informatique/wiw-ae-app`

### Étape 2 : Ajouter la base de données PostgreSQL

1. **Dans votre projet Railway**
   - Cliquez sur **"+ New"**
   - Sélectionnez **"Database"** > **"Add PostgreSQL"**
   - Railway créera automatiquement une base de données PostgreSQL

2. **Récupérer la variable DATABASE_URL**
   - Cliquez sur la base de données créée
   - Allez dans l'onglet **"Variables"**
   - Copiez la variable `DATABASE_URL` (elle sera automatiquement partagée avec les services)

### Étape 3 : Déployer le Backend

1. **Créer un service Backend**
   - Dans votre projet, cliquez sur **"+ New"**
   - Sélectionnez **"GitHub Repo"**
   - Choisissez votre repository
   - Railway détectera automatiquement le monorepo

2. **Configurer le service Backend**
   - **Root Directory** : `backend`
   - **Build Command** : `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command** : `npm start`

3. **Variables d'environnement** (dans Settings > Variables)
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=[générer une clé secrète de 32+ caractères]
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=[URL du frontend après déploiement]
   CORS_ORIGIN=[URL du frontend après déploiement]
   ```
   - `DATABASE_URL` sera automatiquement injectée depuis la base de données

4. **Générer un domaine public**
   - Dans Settings > Networking
   - Cliquez sur **"Generate Domain"**
   - Notez l'URL générée (ex: `wiw-ae-backend.up.railway.app`)

### Étape 4 : Déployer le Frontend

1. **Créer un service Frontend**
   - Dans votre projet, cliquez sur **"+ New"**
   - Sélectionnez **"GitHub Repo"**
   - Choisissez votre repository

2. **Configurer le service Frontend**
   - **Root Directory** : `frontend`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npx serve -s dist -l $PORT`

3. **Installer serve pour le frontend**
   - Ajoutez dans `frontend/package.json` :
     ```json
     "dependencies": {
       "serve": "^14.2.0"
     }
     ```

4. **Variables d'environnement**
   ```
   VITE_API_URL=https://wiw-ae-backend.up.railway.app/api
   NODE_ENV=production
   ```

5. **Générer un domaine public**
   - Dans Settings > Networking
   - Cliquez sur **"Generate Domain"**
   - Notez l'URL générée (ex: `wiw-ae-frontend.up.railway.app`)

6. **Mettre à jour les variables du Backend**
   - Retournez dans le service Backend
   - Mettez à jour :
     ```
     FRONTEND_URL=https://wiw-ae-frontend.up.railway.app
     CORS_ORIGIN=https://wiw-ae-frontend.up.railway.app
     ```

### Étape 5 : Configuration SPA (Single Page Application)

Pour que le routing React fonctionne correctement :

1. **Créer un fichier `railway.json` dans `frontend/`** :
   ```json
   {
     "rewrites": [
       {
         "source": "/*",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. **Ou utiliser serve avec les bonnes options** :
   - Modifier le `startCommand` dans Railway :
     ```
     npx serve -s dist -l $PORT --single
     ```

## 🔧 Méthode 2 : Configuration via Railway CLI

### Installation Railway CLI

```bash
npm i -g @railway/cli
railway login
```

### Déploiement

```bash
# Initialiser Railway dans le projet
railway init

# Lier à un projet existant
railway link

# Déployer
railway up
```

### Variables d'environnement via CLI

```bash
# Backend
cd backend
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=your-secret-key-here
railway variables set JWT_EXPIRES_IN=7d

# Frontend
cd frontend
railway variables set VITE_API_URL=https://your-backend-url.up.railway.app/api
```

## 📝 Structure du projet Railway

```
wiw-ae-app/
├── railway.json          # Configuration Railway (optionnel)
├── backend/
│   ├── package.json
│   └── railway.json      # Config spécifique backend (optionnel)
└── frontend/
    ├── package.json
    └── railway.json      # Config spécifique frontend (optionnel)
```

## 🔍 Vérification du déploiement

### Backend

1. **Vérifier les logs**
   - Dans Railway Dashboard > Service Backend > Logs
   - Vérifier que le serveur démarre correctement

2. **Tester l'API**
   - `https://wiw-ae-backend.up.railway.app/api/health`
   - Devrait retourner `{"status":"ok"}`

### Frontend

1. **Vérifier les logs**
   - Dans Railway Dashboard > Service Frontend > Logs
   - Vérifier que le build réussit

2. **Tester l'application**
   - `https://wiw-ae-frontend.up.railway.app`
   - L'application devrait se charger

## 🐛 Dépannage

### Backend ne démarre pas

1. **Vérifier les variables d'environnement**
   - `DATABASE_URL` doit être définie
   - `JWT_SECRET` doit faire au moins 32 caractères

2. **Vérifier les logs**
   - Railway Dashboard > Service > Logs
   - Chercher les erreurs de connexion à la base de données

### Frontend ne se charge pas

1. **Vérifier le build**
   - Les logs doivent montrer `Build completed successfully`
   - Vérifier que `dist/` contient les fichiers

2. **Vérifier les routes SPA**
   - S'assurer que `serve --single` est utilisé
   - Ou configurer les rewrites dans Railway

### Erreurs CORS

1. **Vérifier CORS_ORIGIN dans le backend**
   - Doit correspondre exactement à l'URL du frontend
   - Inclure le protocole `https://`

2. **Vérifier FRONTEND_URL**
   - Doit être l'URL complète du frontend

## 💰 Coûts Railway

- **Hobby Plan** : $5/mois (500 heures gratuites)
- **Pro Plan** : $20/mois (plus de ressources)
- **PostgreSQL** : Inclus dans les plans payants

## 🔄 Mise à jour automatique

Railway déploie automatiquement à chaque push sur la branche principale si :
- Le repository GitHub est connecté
- Le service est configuré pour auto-deploy

Pour désactiver :
- Settings > Source > Disable Auto Deploy

## 📚 Ressources

- Documentation Railway : https://docs.railway.app
- Railway Discord : https://discord.gg/railway
- Support : support@railway.app

