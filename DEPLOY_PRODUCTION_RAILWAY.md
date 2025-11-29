# 🚀 Guide de Déploiement Railway - WIW-AE+ v0.2.0

Guide complet pour déployer WIW-AE+ sur Railway avec toutes les nouvelles fonctionnalités de sécurité.

## 📋 Prérequis

- Compte Railway.app
- Repository GitHub connecté
- Compte email SMTP (Gmail, SendGrid, Mailgun, etc.)

## 🎯 Architecture de Déploiement

```
Railway Project
├── PostgreSQL Database (service Railway)
├── Backend API (Node.js/Express)
└── Frontend (React/Vite)
```

---

## 📦 ÉTAPE 1: Créer le Projet Railway

1. Aller sur https://railway.app
2. Cliquer sur **"New Project"**
3. Sélectionner **"Deploy from GitHub repo"**
4. Choisir le repository `wiw-ae-app`
5. Railway va détecter automatiquement le monorepo

---

## 🗄️ ÉTAPE 2: Déployer la Base de Données PostgreSQL

1. Dans votre projet Railway, cliquer sur **"+ New"**
2. Sélectionner **"Database"** → **"Add PostgreSQL"**
3. Railway va créer automatiquement la base de données
4. Copier la variable `DATABASE_URL` (on l'utilisera pour le backend)

**Important:** Noter l'URL de connexion qui ressemble à:
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

---

## 🔧 ÉTAPE 3: Déployer le Backend

### 3.1 Créer le Service Backend

1. Cliquer sur **"+ New"** → **"GitHub Repo"**
2. Sélectionner votre repository `wiw-ae-app`
3. Dans les paramètres du service:
   - **Root Directory:** `backend`
   - **Build Command:** (Railway détecte automatiquement)
   - **Start Command:** `npm start`

### 3.2 Configurer les Variables d'Environnement Backend

Dans l'onglet **"Variables"** du service backend, ajouter:

#### Variables Essentielles

```bash
# Serveur
NODE_ENV=production
PORT=4000
HOST=0.0.0.0

# Base de données (automatique si PostgreSQL dans le même projet)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Sécurité - JWT Secret (CRITIQUE!)
# Générer une clé sécurisée avec: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=<VOTRE_SECRET_256_BITS>

# CORS - Origins autorisées (IMPORTANT!)
# Remplacer par votre domaine frontend Railway
ALLOWED_ORIGINS=https://votre-frontend.up.railway.app

# OU utiliser une seule origin:
# CORS_ORIGIN=https://votre-frontend.up.railway.app

# Frontend URL (sera fournie après déploiement frontend)
FRONTEND_URL=https://votre-frontend.up.railway.app

# Rate Limiting (ajuster selon votre trafic)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Variables Email (OBLIGATOIRE pour reset password)

**Option 1: Gmail**
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=<app-specific-password>
EMAIL_FROM=noreply@wiw-ae-plus.com
```

> **Note Gmail:** Créer un "App Password" dans les paramètres de sécurité Google

**Option 2: SendGrid (Recommandé pour production)**
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=<votre-api-key-sendgrid>
EMAIL_FROM=noreply@votre-domaine.com
```

**Option 3: Mailgun**
```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=<votre-username-mailgun>
EMAIL_PASSWORD=<votre-password-mailgun>
EMAIL_FROM=noreply@votre-domaine.com
```

### 3.3 Vérifications Backend

Après le déploiement du backend:

1. **Vérifier les logs** dans Railway
2. **Tester le health check:**
   ```bash
   curl https://votre-backend.up.railway.app/api/health
   ```

   Réponse attendue:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-11-29T...",
     "uptime": 123.45,
     "cors": {
       "allowAll": false,
       "allowedOrigins": ["https://votre-frontend.up.railway.app"],
       "origin": "none"
     }
   }
   ```

3. **Tester la base de données:**
   ```bash
   curl https://votre-backend.up.railway.app/api/ready
   ```

   Réponse attendue:
   ```json
   {
     "status": "ready",
     "database": "connected",
     "timestamp": "2025-11-29T..."
   }
   ```

---

## 🎨 ÉTAPE 4: Déployer le Frontend

### 4.1 Créer le Service Frontend

1. Cliquer sur **"+ New"** → **"GitHub Repo"**
2. Sélectionner votre repository `wiw-ae-app`
3. Dans les paramètres du service:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Start Command:** (Railway utilise le Dockerfile automatiquement)

### 4.2 Configurer les Variables d'Environnement Frontend

Dans l'onglet **"Variables"** du service frontend:

```bash
# URL de l'API Backend (récupérer depuis le service backend)
VITE_API_URL=https://votre-backend.up.railway.app/api
```

### 4.3 Vérifications Frontend

1. **Vérifier que le build réussit** dans les logs Railway
2. **Tester l'accès:**
   ```
   https://votre-frontend.up.railway.app
   ```
3. **Tester la connexion à l'API** via la page de login

---

## 🔄 ÉTAPE 5: Mise à Jour des CORS

**IMPORTANT:** Une fois le frontend déployé, retourner dans le backend pour mettre à jour les CORS:

1. Aller dans le service **Backend** → **Variables**
2. Mettre à jour `ALLOWED_ORIGINS` avec l'URL réelle du frontend:
   ```bash
   ALLOWED_ORIGINS=https://wiw-app-production.up.railway.app
   ```
3. Mettre à jour `FRONTEND_URL`:
   ```bash
   FRONTEND_URL=https://wiw-app-production.up.railway.app
   ```
4. **Redéployer le backend** pour appliquer les changements

---

## ✅ ÉTAPE 6: Tests Post-Déploiement

### Test 1: Inscription
1. Aller sur `https://votre-frontend.up.railway.app`
2. Créer un compte test
3. Vérifier que l'inscription fonctionne

### Test 2: Connexion
1. Se connecter avec le compte créé
2. Vérifier que le cookie JWT est bien défini (F12 → Application → Cookies)
3. Le cookie doit avoir les flags: `HttpOnly`, `Secure`, `SameSite`

### Test 3: Reset Password
1. Cliquer sur "Mot de passe oublié"
2. Entrer un email
3. **Vérifier que l'email est bien reçu** avec le lien de reset
4. Cliquer sur le lien et réinitialiser le mot de passe

### Test 4: API Protégées
1. Une fois connecté, naviguer dans l'application
2. Créer un projet de test
3. Vérifier que les données sont sauvegardées en base

### Test 5: Rate Limiting
1. Se déconnecter
2. Essayer de se connecter 6 fois avec un mauvais mot de passe
3. **Vérifier que le compte est bloqué** après 5 tentatives
4. Message attendu: "Trop de tentatives de connexion échouées..."

### Test 6: CORS
1. Ouvrir la console navigateur (F12)
2. Vérifier qu'il n'y a **aucune erreur CORS**
3. Si erreurs CORS → vérifier `ALLOWED_ORIGINS` dans le backend

---

## 🔒 Checklist de Sécurité Production

Avant de mettre en production, vérifier:

- [ ] `NODE_ENV=production` sur le backend
- [ ] `JWT_SECRET` généré avec crypto (256 bits minimum)
- [ ] `ALLOWED_ORIGINS` configuré avec le domaine frontend exact
- [ ] Configuration email SMTP testée et fonctionnelle
- [ ] HTTPS activé sur les deux services (automatique sur Railway)
- [ ] Cookies httpOnly + Secure + SameSite visibles dans le navigateur
- [ ] Rate limiting testé et fonctionnel
- [ ] Reset password par email testé
- [ ] Backups de la base de données configurés (Railway Settings)
- [ ] Monitoring des erreurs configuré (voir logs Railway)
- [ ] Variables d'environnement sensibles non committées dans git

---

## 🔧 Configuration Avancée

### Domaine Personnalisé

1. Dans Railway, aller dans le service → **Settings** → **Domains**
2. Cliquer sur **"Add Domain"**
3. Entrer votre domaine personnalisé
4. Configurer les DNS selon les instructions Railway
5. **Mettre à jour** `ALLOWED_ORIGINS` et `FRONTEND_URL` avec le nouveau domaine

### Backups Automatiques

1. Dans le service PostgreSQL → **Settings**
2. Activer **"Backup on Railway"** (plan payant)
3. Ou configurer des backups externes via cron job

### Monitoring

**Logs Railway:**
- Accessible directement dans l'interface Railway
- Filtrer par niveau (info, warn, error)
- Exporter si nécessaire

**Metrics:**
- Railway fournit CPU, RAM, Network
- Pour monitoring avancé, intégrer Sentry:
  ```bash
  # Ajouter à backend
  npm install @sentry/node

  # Variable d'environnement
  SENTRY_DSN=https://...@sentry.io/...
  ```

---

## 🐛 Dépannage

### Erreur: "Can't reach database server"

**Solution:**
1. Vérifier que `DATABASE_URL` est bien configurée
2. Vérifier que PostgreSQL est dans le même projet Railway
3. Utiliser la variable de référence: `${{Postgres.DATABASE_URL}}`

### Erreur: CORS blocked

**Solution:**
1. Vérifier `ALLOWED_ORIGINS` contient l'URL exacte du frontend
2. Pas de slash final: ✅ `https://app.com` ❌ `https://app.com/`
3. Redéployer le backend après changement

### Erreur: "JWT must be provided"

**Causes possibles:**
1. Cookie httpOnly non défini → vérifier réseau (F12)
2. CORS bloque le cookie → vérifier CORS
3. Cookie expiré (24h) → se reconnecter

**Solution:**
- Vérifier que `credentials: true` dans CORS (déjà configuré)
- Vérifier que le frontend envoie `credentials: 'include'` dans les requêtes

### Erreur: Email non reçu

**Solution:**
1. Vérifier les variables `EMAIL_*` dans Railway
2. Tester la connexion SMTP:
   ```bash
   # Dans les logs backend, chercher:
   "Email de réinitialisation envoyé"
   ```
3. Vérifier les spams
4. Pour Gmail, vérifier que l'App Password est correct

### Backend crash au démarrage

**Solution:**
1. Vérifier les logs Railway
2. Chercher les erreurs de validation des variables d'environnement
3. Vérifier que toutes les variables obligatoires sont définies

---

## 📊 Variables d'Environnement - Récapitulatif

### Backend (Production)

```bash
# Serveur
NODE_ENV=production
PORT=4000
HOST=0.0.0.0

# Database
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Security
JWT_SECRET=<256-bit-random-generated-secret>
ALLOWED_ORIGINS=https://your-frontend.up.railway.app
FRONTEND_URL=https://your-frontend.up.railway.app

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<app-password>
EMAIL_FROM=noreply@wiw-ae-plus.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (Production)

```bash
VITE_API_URL=https://your-backend.up.railway.app/api
```

---

## 🚀 Commandes Utiles Railway CLI

Installer Railway CLI:
```bash
npm install -g @railway/cli
```

Commandes utiles:
```bash
# Login
railway login

# Lier un service
railway link

# Voir les logs en temps réel
railway logs

# Lancer une commande dans le service
railway run npm run db:migrate

# Redéployer
railway up

# Voir les variables
railway variables
```

---

## 📈 Mise à l'Échelle

Railway permet de scaler facilement:

1. **Vertical Scaling:** Augmenter CPU/RAM dans Settings
2. **Horizontal Scaling:** Augmenter le nombre d'instances (plan payant)
3. **Database Scaling:** Upgrader PostgreSQL dans Settings

**Recommandations:**
- Commencer avec les ressources par défaut
- Monitorer les performances
- Scaler uniquement si nécessaire

---

## 🎉 Félicitations !

Votre application WIW-AE+ est maintenant déployée en production sur Railway avec:
- ✅ Sécurité renforcée (JWT httpOnly, rate limiting, CORS strict)
- ✅ Reset password par email fonctionnel
- ✅ Validation des inputs
- ✅ Logs centralisés
- ✅ 0 vulnérabilités npm
- ✅ Documentation complète

**URLs à communiquer:**
- Frontend: `https://your-frontend.up.railway.app`
- Backend API: `https://your-backend.up.railway.app/api`
- Health Check: `https://your-backend.up.railway.app/api/health`

---

**Version:** 0.2.0
**Dernière mise à jour:** 2025-11-29
**Support:** Voir [SECURITY.md](../SECURITY.md) et [README.md](../README.md)
