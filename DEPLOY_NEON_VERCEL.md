# 🚀 Guide Déploiement Neon + Vercel

Guide pas-à-pas pour déployer WIW-AE+ avec Neon (PostgreSQL) et Vercel (hosting).

---

## 📋 Étape 1 : Créer la Base de Données Neon

### 1.1 Créer un Compte Neon

1. Visitez : https://console.neon.tech
2. Créez un compte (gratuit) ou connectez-vous
3. Le plan gratuit inclut :
   - ✅ 1 projet
   - ✅ 10 branches
   - ✅ 3GB de stockage
   - ✅ 100 heures de compute/mois

### 1.2 Créer le Projet PostgreSQL

1. **Dashboard Neon** → **New Project**
2. Configurez :
   ```
   Project Name: wiw-ae-production
   Region: Europe (Frankfurt)  ← Choisissez la région la plus proche
   PostgreSQL Version: 16
   ```
3. Cliquez sur **Create Project**

### 1.3 Récupérer la Connection String

Une fois le projet créé :

1. **Project Dashboard** → **Connection Details**
2. Copiez le **Connection String** :
   ```
   postgresql://neondb_owner:xxxx@ep-xxxx-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
3. ⚠️ **IMPORTANT** : Gardez cette string secrète !

---

## 📋 Étape 2 : Migrer le Schéma Prisma vers Neon

### 2.1 Configurer DATABASE_URL localement

```bash
# Dans backend/.env.local
cd backend
echo "DATABASE_URL=\"postgresql://votre-connection-string-neon\"" > .env.local
```

### 2.2 Générer le Client Prisma

```bash
npx prisma generate
```

### 2.3 Créer les Tables (Migration)

```bash
# Option 1 : Push direct (recommandé pour Neon)
npx prisma db push

# Option 2 : Créer une migration
npx prisma migrate dev --name init_neon
```

**Résultat attendu** :
```
✔ Generated Prisma Client
✔ The database is now in sync with your Prisma schema
```

### 2.4 Vérifier les Tables

```bash
npx prisma studio
```

Cela ouvre Prisma Studio sur http://localhost:5555 pour visualiser vos tables.

---

## 📋 Étape 3 : Déployer le Backend sur Vercel

### 3.1 Créer le Projet Backend Vercel

1. **Vercel Dashboard** → https://vercel.com/new
2. **Import Git Repository** → Sélectionnez `wiw-ae-app`
3. **Configure Project** :
   ```
   Project Name: wiw-ae-backend
   Framework Preset: Other
   Root Directory: backend/          ← IMPORTANT !
   Build Command: npm ci && npx prisma generate
   Output Directory: (laisser vide)
   Install Command: npm install
   ```

### 3.2 Ajouter les Variables d'Environnement

Dans **Settings** → **Environment Variables**, ajoutez :

#### Base de Données
```bash
DATABASE_URL=postgresql://votre-connection-string-neon
```

#### JWT Secret
Générez un secret sécurisé :
```bash
# Exécutez dans votre terminal local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copiez le résultat dans :
```bash
JWT_SECRET=le-secret-généré-64-caractères
```

#### Email (Gmail)
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-application-16-chars
EMAIL_FROM=noreply@wiw-ae.com
```

**Comment créer un App Password Gmail** :
1. Google Account → Sécurité → Validation en deux étapes (activez si désactivé)
2. Recherchez "Mots de passe des applications"
3. Créez un mot de passe pour "Mail" / "Autre (nom personnalisé)"
4. Copiez le mot de passe de 16 caractères (sans espaces)

#### Frontend URL (provisoire)
```bash
FRONTEND_URL=https://wiw-ae-frontend.vercel.app
```
⚠️ On mettra à jour après le déploiement frontend

#### Node Environment
```bash
NODE_ENV=production
```

### 3.3 Déployer le Backend

1. Cliquez sur **Deploy** 🚀
2. Attendez le build (2-3 minutes)
3. Une fois déployé, notez l'URL : `https://wiw-ae-backend.vercel.app`

### 3.4 Tester l'API Backend

```bash
# Test du endpoint health
curl https://wiw-ae-backend.vercel.app/api/health

# Résultat attendu
{"status":"ok","database":"connected"}
```

---

## 📋 Étape 4 : Déployer le Frontend sur Vercel

### 4.1 Créer le Projet Frontend Vercel

1. **Vercel Dashboard** → **New Project**
2. **Import Git Repository** → Sélectionnez `wiw-ae-app` (encore)
3. **Configure Project** :
   ```
   Project Name: wiw-ae-frontend
   Framework Preset: Vite
   Root Directory: frontend/         ← IMPORTANT !
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### 4.2 Ajouter les Variables d'Environnement

Dans **Settings** → **Environment Variables** :

```bash
VITE_API_URL=https://wiw-ae-backend.vercel.app/api
```

⚠️ Remplacez par l'URL réelle de votre backend Vercel

### 4.3 Déployer le Frontend

1. Cliquez sur **Deploy** 🚀
2. Attendez le build (2-3 minutes)
3. Une fois déployé, notez l'URL : `https://wiw-ae-frontend.vercel.app`

---

## 📋 Étape 5 : Configuration Finale

### 5.1 Mettre à Jour CORS Backend

Le frontend est maintenant déployé, il faut mettre à jour le CORS :

1. **Backend Vercel Project** → **Settings** → **Environment Variables**
2. Modifiez `FRONTEND_URL` :
   ```bash
   FRONTEND_URL=https://wiw-ae-frontend.vercel.app
   ```
   ⚠️ Utilisez l'URL exacte de votre frontend

3. **Redéployez le backend** :
   - **Deployments** → Dernier déploiement → **⋯** → **Redeploy**

### 5.2 Tester l'Application Complète

1. **Ouvrez le frontend** : https://wiw-ae-frontend.vercel.app
2. **Testez la connexion** :
   - Essayez de vous inscrire ou de vous connecter
   - Vérifiez que l'API répond correctement
3. **Consultez les logs** en cas d'erreur :
   - Backend : Vercel Dashboard → Deployments → View Function Logs
   - Frontend : DevTools Console (F12)

---

## 🎯 Checklist Finale

### Backend ✅
- [ ] Projet Vercel créé avec Root Directory `backend/`
- [ ] `DATABASE_URL` Neon configurée
- [ ] `JWT_SECRET` généré (64 chars)
- [ ] Variables `EMAIL_*` configurées
- [ ] `FRONTEND_URL` pointe vers le frontend Vercel
- [ ] Build réussi ✅
- [ ] `/api/health` retourne `{"status":"ok"}`
- [ ] Tables Prisma créées dans Neon

### Frontend ✅
- [ ] Projet Vercel créé avec Root Directory `frontend/`
- [ ] `VITE_API_URL` pointe vers le backend Vercel
- [ ] Build réussi ✅
- [ ] Page de login accessible
- [ ] Connexion API fonctionnelle
- [ ] Inscription/Login fonctionne

### Database ✅
- [ ] Projet Neon créé
- [ ] Connection String récupérée
- [ ] Schéma Prisma migré
- [ ] Tables visibles dans Prisma Studio

---

## 🐛 Troubleshooting

### Erreur : "Database connection failed"

**Solution** :
1. Vérifiez que `DATABASE_URL` est correcte dans Vercel
2. Assurez-vous d'avoir `?sslmode=require` à la fin de l'URL
3. Testez la connexion localement :
   ```bash
   cd backend
   npx prisma db push
   ```

### Erreur : "CORS blocked"

**Solutions** :
1. Vérifiez `FRONTEND_URL` dans Backend Vercel Environment Variables
2. Assurez-vous que `FRONTEND_URL` correspond EXACTEMENT à l'URL frontend
3. Redéployez le backend après modification

### Erreur : "Failed to fetch API"

**Solutions** :
1. Vérifiez `VITE_API_URL` dans Frontend Environment Variables
2. Testez manuellement :
   ```bash
   curl https://votre-backend.vercel.app/api/health
   ```
3. Vérifiez les logs Backend : Vercel → Deployments → Logs

### Erreur : "Prisma Client not generated"

**Solution** :
1. Vérifiez que le Build Command inclut `npx prisma generate`
2. Backend Vercel → Settings → Build & Development Settings
3. Build Command doit être :
   ```bash
   npm ci && npx prisma generate
   ```

---

## 📚 Ressources

- **Neon Docs** : https://neon.tech/docs
- **Vercel Docs** : https://vercel.com/docs
- **Prisma + Vercel** : https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- **Prisma + Neon** : https://www.prisma.io/docs/guides/database/neon

---

## 🎉 Résumé

```
┌─────────────────────────────────────┐
│  Frontend (Vite/React)              │
│  https://wiw-ae-frontend.vercel.app │
└─────────────┬───────────────────────┘
              │ HTTP/REST API
              ↓
┌─────────────────────────────────────┐
│  Backend (Express + Prisma)         │
│  https://wiw-ae-backend.vercel.app  │
└─────────────┬───────────────────────┘
              │ PostgreSQL
              ↓
┌─────────────────────────────────────┐
│  Database (Neon PostgreSQL)         │
│  ep-xxxx.eu-central-1.aws.neon.tech │
└─────────────────────────────────────┘
```

**Architecture finale** :
- ✅ Frontend statique sur Vercel (CDN global)
- ✅ Backend serverless sur Vercel (auto-scaling)
- ✅ Database PostgreSQL sur Neon (serverless, auto-sleep)
- ✅ Déploiements automatiques via Git push
- ✅ HTTPS partout par défaut
- ✅ Coût : **Gratuit** jusqu'à des volumes importants

Bonne chance ! 🚀
