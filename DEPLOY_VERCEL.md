# 🚀 Déploiement Vercel - WIW-AE+

Guide complet pour déployer le monorepo sur Vercel.

## 📋 Prérequis

- Compte Vercel (gratuit) : https://vercel.com/signup
- Repository GitHub `wiw-ae-app` accessible
- Base de données PostgreSQL externe (Neon, Supabase, Railway, etc.)

---

## 🎯 Architecture Recommandée

### **Option A : Deux Projets Vercel (Recommandé)**

```
Vercel Project 1: wiw-ae-backend
├─ Root Directory: backend/
└─ Type: Node.js Application

Vercel Project 2: wiw-ae-frontend
├─ Root Directory: frontend/
└─ Type: Vite/React Static Site
```

**Avantages** :
- ✅ Configuration simple et claire
- ✅ Déploiements indépendants
- ✅ Scaling séparé frontend/backend
- ✅ Logs séparés par service

### **Option B : Un Projet Monorepo**

Un seul projet Vercel avec `vercel.json` (déjà configuré)

---

## 🏗️ Option A : Deux Projets Séparés (Recommandé)

### **1️⃣ Déployer le Backend**

#### Étape 1 : Créer le projet Backend

1. Allez sur https://vercel.com/new
2. **Import Git Repository** → Sélectionnez `wiw-ae-app`
3. Dans **Configure Project** :

```
Project Name: wiw-ae-backend
Framework Preset: Other
Root Directory: backend/          ← IMPORTANT
Build Command: npm ci && npx prisma generate
Output Directory: (laisser vide)
Install Command: npm install
```

#### Étape 2 : Variables d'environnement Backend

Ajoutez dans **Environment Variables** :

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=votre-secret-jwt-super-securise-min-32-chars

# Email (Gmail, SendGrid, Mailgun)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-application
EMAIL_FROM=noreply@wiw-ae.com

# Node
NODE_ENV=production

# Frontend URL (pour CORS)
FRONTEND_URL=https://wiw-ae-frontend.vercel.app
```

#### Étape 3 : Déployer

Cliquez sur **Deploy** ! 🚀

Le backend sera disponible sur : `https://wiw-ae-backend.vercel.app`

---

### **2️⃣ Déployer le Frontend**

#### Étape 1 : Créer le projet Frontend

1. **New Project** → Sélectionnez à nouveau `wiw-ae-app`
2. Dans **Configure Project** :

```
Project Name: wiw-ae-frontend
Framework Preset: Vite
Root Directory: frontend/         ← IMPORTANT
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### Étape 2 : Variables d'environnement Frontend

```bash
VITE_API_URL=https://wiw-ae-backend.vercel.app/api
```

#### Étape 3 : Déployer

Cliquez sur **Deploy** ! 🚀

Le frontend sera disponible sur : `https://wiw-ae-frontend.vercel.app`

---

### **3️⃣ Configuration Finale**

#### Mettre à jour CORS Backend

Une fois le frontend déployé, **retournez dans le projet Backend** :

1. **Settings** → **Environment Variables**
2. Modifiez `FRONTEND_URL` :

```bash
FRONTEND_URL=https://wiw-ae-frontend.vercel.app
```

3. **Redéployez le backend** (Deployments → Redeploy)

#### Tester l'application

- Frontend : https://wiw-ae-frontend.vercel.app
- Backend API : https://wiw-ae-backend.vercel.app/api/health

---

## 🏗️ Option B : Un Seul Projet Monorepo

Si vous préférez un seul projet Vercel avec `vercel.json` :

### Étape 1 : Créer le projet

1. **New Project** → `wiw-ae-app`
2. **Configure Project** :

```
Project Name: wiw-ae-app
Framework Preset: Other
Root Directory: (laisser vide - racine)
```

### Étape 2 : Variables d'environnement

Ajoutez **TOUTES** les variables (Backend + Frontend) listées ci-dessus.

### Étape 3 : Déployer

Vercel détecte automatiquement `vercel.json` et configure les routes.

**Note** : Cette option est **moins optimale** car :
- Backend et frontend partagent le même domaine
- Pas de scaling indépendant
- Configuration plus complexe

---

## 🗄️ Base de Données PostgreSQL

Vercel **ne fournit pas** de base de données PostgreSQL directement. Utilisez :

### **Option 1 : Neon (Recommandé - Gratuit)**

1. https://neon.tech (Serverless Postgres)
2. Créez une nouvelle database
3. Copiez l'URL : `postgresql://user:pass@host/db?sslmode=require`
4. Ajoutez dans Vercel Environment Variables

### **Option 2 : Supabase (Gratuit)**

1. https://supabase.com
2. Créez un projet
3. Database Settings → Connection String
4. Utilisez la connection string directe (pas pooling)

### **Option 3 : Railway Database**

Si vous avez déjà une DB sur Railway :
1. Railway Dashboard → PostgreSQL
2. Connect → Copy PostgreSQL Connection URL
3. Utilisez dans Vercel

---

## 🔧 Commandes Utiles

### Développement Local

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Build Local (tester avant déploiement)

```bash
# Backend
cd backend
npm ci
npx prisma generate
npm start

# Frontend
cd frontend
npm ci
npm run build
npm run preview
```

---

## ✅ Checklist Déploiement

### Backend
- [ ] Projet créé avec Root Directory `backend/`
- [ ] DATABASE_URL configurée
- [ ] JWT_SECRET généré (min 32 caractères)
- [ ] Variables EMAIL_* configurées
- [ ] FRONTEND_URL pointe vers le frontend Vercel
- [ ] Build réussi
- [ ] Endpoint `/api/health` accessible

### Frontend
- [ ] Projet créé avec Root Directory `frontend/`
- [ ] VITE_API_URL pointe vers backend Vercel
- [ ] Build réussi
- [ ] Page de login accessible
- [ ] Connexion API fonctionnelle

---

## 🐛 Troubleshooting

### Erreur : "Build failed - Cannot find module"

**Solution** : Vérifiez que `Root Directory` est bien configuré.

### Erreur : "Database connection failed"

**Solutions** :
1. Vérifiez `DATABASE_URL` dans Environment Variables
2. Assurez-vous que la DB accepte les connexions SSL
3. Testez la connexion avec `npx prisma db push`

### Erreur : "CORS blocked"

**Solutions** :
1. Backend : Vérifiez `FRONTEND_URL` dans Environment Variables
2. Backend : `backend/src/server.js` doit avoir :
```js
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

### Frontend : "Failed to fetch API"

**Solutions** :
1. Vérifiez `VITE_API_URL` dans Frontend Environment Variables
2. Testez manuellement : `curl https://backend-url/api/health`
3. Regardez les logs Backend : Vercel Dashboard → Deployments → Logs

---

## 📚 Documentation

- Vercel Docs : https://vercel.com/docs
- Vercel Monorepos : https://vercel.com/docs/monorepos
- Prisma + Vercel : https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel

---

## 🎯 Résumé

**Déploiement recommandé** :

```
┌─────────────────────────────────────┐
│  Vercel Project 1: Backend          │
│  URL: wiw-ae-backend.vercel.app     │
│  Root Directory: backend/           │
└─────────────────────────────────────┘
              ↓ API
┌─────────────────────────────────────┐
│  Vercel Project 2: Frontend         │
│  URL: wiw-ae-frontend.vercel.app    │
│  Root Directory: frontend/          │
└─────────────────────────────────────┘
              ↓ Data
┌─────────────────────────────────────┐
│  Database (Neon/Supabase/Railway)   │
│  PostgreSQL                         │
└─────────────────────────────────────┘
```

Bonne chance ! 🚀
