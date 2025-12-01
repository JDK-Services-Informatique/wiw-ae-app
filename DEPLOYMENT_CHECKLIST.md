# ✅ Checklist Déploiement WIW-AE+ Production

Guide pas-à-pas pour déployer votre application en production.

---

## 🎯 Secrets Générés

### JWT Secret (à copier dans Vercel)
```bash
JWT_SECRET=70d3e1d96841c6cbb722912a66752722d089e509f9f06069ad5226ce396bad92
```

⚠️ **IMPORTANT** : Gardez ce secret confidentiel ! Ne le committez JAMAIS dans Git.

---

## 📋 Étape 1 : Créer la Base de Données Neon

### 1.1 Accéder à Neon Console

```bash
# Ouvrez dans votre navigateur :
https://console.neon.tech
```

### 1.2 Créer un Nouveau Projet

1. **Cliquez sur** : "New Project" (bouton vert en haut à droite)
2. **Configurez** :
   - **Project Name** : `wiw-ae-production`
   - **Region** : `Europe (Frankfurt)` ou `Europe (London)` (plus proche de vos utilisateurs)
   - **PostgreSQL Version** : `16` (recommandé)
   - **Compute Size** : Laissez par défaut (0.25 vCPU - suffisant pour débuter)

3. **Cliquez sur** : "Create Project"

### 1.3 Récupérer la Connection String

Une fois le projet créé :

1. Vous êtes redirigé vers le **Dashboard**
2. Section **Connection Details** visible directement
3. **Copiez** la **Connection String** (format complet) :
   ```
   postgresql://neondb_owner:XXXXX@ep-XXXX-XXXX.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

4. ⚠️ **GARDEZ cette string secrète** - elle contient le mot de passe de la base !

### 1.4 Tester la Connexion Localement

```bash
cd backend

# Créer un fichier .env.local avec la connection string
echo 'DATABASE_URL="votre-connection-string-copiée"' > .env.local

# Générer le client Prisma
npx prisma generate

# Créer les tables dans Neon
npx prisma db push
```

**Résultat attendu** :
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema. Done in 2.5s
```

### 1.5 Vérifier les Tables Créées

```bash
# Ouvrir Prisma Studio
npx prisma studio
```

Cela ouvre http://localhost:5555 où vous pouvez voir toutes vos tables :
- ✅ Utilisateur
- ✅ Projet
- ✅ AppelOffre
- ✅ Mission
- ✅ Devis
- ✅ etc.

---

## 📋 Étape 2 : Configurer Email (Gmail)

### 2.1 Créer un App Password Gmail

1. **Accédez à** : https://myaccount.google.com/security
2. **Activez** la "Validation en deux étapes" (si pas déjà fait)
3. **Recherchez** "Mots de passe des applications"
4. **Cliquez sur** "Mots de passe des applications"
5. **Sélectionnez** :
   - App : **Mail**
   - Device : **Autre (nom personnalisé)** → Tapez : `WIW-AE Backend`
6. **Cliquez sur** "Générer"
7. **Copiez** le mot de passe de 16 caractères (sans espaces)

### 2.2 Variables Email à Noter

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=le-mot-de-passe-16-chars-généré
EMAIL_FROM=noreply@wiw-ae.com
```

---

## 📋 Étape 3 : Déployer le Backend sur Vercel

### 3.1 Créer le Projet Backend

1. **Accédez à** : https://vercel.com/new
2. **Import Git Repository** → Sélectionnez `wiw-ae-app`
3. **Configure Project** :
   - **Project Name** : `wiw-ae-backend`
   - **Framework Preset** : `Other`
   - **Root Directory** : `backend/` ← **CRITIQUE !**
   - **Build Command** : `npm ci && npx prisma generate`
   - **Output Directory** : (laisser vide)
   - **Install Command** : `npm install`

### 3.2 Ajouter les Environment Variables

Dans **Settings** → **Environment Variables**, ajoutez UNE PAR UNE :

```bash
# Database
DATABASE_URL=postgresql://votre-connection-string-neon

# JWT
JWT_SECRET=70d3e1d96841c6cbb722912a66752722d089e509f9f06069ad5226ce396bad92

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-app-password-16-chars
EMAIL_FROM=noreply@wiw-ae.com

# Frontend (provisoire - on mettra à jour après)
FRONTEND_URL=https://wiw-ae-frontend.vercel.app

# Node
NODE_ENV=production
```

### 3.3 Déployer

1. **Cliquez sur** : "Deploy" 🚀
2. **Attendez** 2-3 minutes (build + déploiement)
3. **Notez l'URL** générée : `https://wiw-ae-backend-xxxx.vercel.app`

### 3.4 Tester l'API

```bash
# Test du endpoint health
curl https://votre-backend.vercel.app/api/health

# Résultat attendu
{"status":"ok","database":"connected"}
```

Si vous obtenez une erreur, consultez :
- **Vercel Dashboard** → **Deployments** → **View Function Logs**

---

## 📋 Étape 4 : Déployer le Frontend sur Vercel

### 4.1 Créer le Projet Frontend

1. **Retournez à** : https://vercel.com/new
2. **Import Git Repository** → Sélectionnez `wiw-ae-app` (encore une fois)
3. **Configure Project** :
   - **Project Name** : `wiw-ae-frontend`
   - **Framework Preset** : `Vite`
   - **Root Directory** : `frontend/` ← **CRITIQUE !**
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`

### 4.2 Ajouter la Variable d'Environnement

Dans **Settings** → **Environment Variables** :

```bash
VITE_API_URL=https://votre-backend-reel.vercel.app/api
```

⚠️ **Remplacez** par l'URL réelle de votre backend Vercel (celle notée à l'étape 3.3)

### 4.3 Déployer

1. **Cliquez sur** : "Deploy" 🚀
2. **Attendez** 2-3 minutes
3. **Notez l'URL** générée : `https://wiw-ae-frontend-xxxx.vercel.app`

---

## 📋 Étape 5 : Configuration Finale CORS

Maintenant que le frontend est déployé, il faut mettre à jour le CORS du backend.

### 5.1 Mettre à Jour FRONTEND_URL

1. **Backend Vercel Project** → **Settings** → **Environment Variables**
2. **Trouvez** la variable `FRONTEND_URL`
3. **Éditez** et remplacez par l'URL réelle du frontend :
   ```bash
   FRONTEND_URL=https://votre-frontend-reel.vercel.app
   ```
4. **Sauvegardez**

### 5.2 Redéployer le Backend

1. **Backend Vercel Project** → **Deployments**
2. **Dernier déploiement** → **⋯** (trois points) → **Redeploy**
3. **Confirmez** le redéploiement

---

## 📋 Étape 6 : Test Complet de l'Application

### 6.1 Accéder au Frontend

Ouvrez dans votre navigateur :
```
https://votre-frontend.vercel.app
```

### 6.2 Tester l'Inscription

1. **Cliquez sur** "S'inscrire"
2. **Remplissez** le formulaire :
   - Nom : Test
   - Prénom : Utilisateur
   - Email : test@example.com
   - Mot de passe : Test123456!
3. **Validez**

**Résultat attendu** :
- ✅ Inscription réussie
- ✅ Redirection vers le tableau de bord
- ✅ Toast de confirmation

### 6.3 Tester le Reset Password

1. **Cliquez sur** "Mot de passe oublié ?"
2. **Entrez** votre email
3. **Vérifiez** votre boîte mail
4. **Cliquez** sur le lien reçu
5. **Changez** le mot de passe

**Résultat attendu** :
- ✅ Email reçu dans les 2 minutes
- ✅ Reset fonctionnel

### 6.4 Vérifier les Logs

En cas d'erreur, consultez :

**Backend Logs** :
- Vercel Dashboard → Backend Project → Deployments → View Function Logs

**Frontend Logs** :
- Ouvrez DevTools (F12) → Console

---

## ✅ Checklist Finale

### Configuration Neon
- [ ] Projet Neon créé
- [ ] Connection String récupérée
- [ ] `npx prisma db push` réussi
- [ ] Tables visibles dans Prisma Studio

### Configuration Email
- [ ] App Password Gmail créé
- [ ] Variables EMAIL_* notées

### Backend Vercel
- [ ] Projet créé avec Root Directory `backend/`
- [ ] Toutes les environment variables ajoutées
- [ ] Build réussi ✅
- [ ] `/api/health` retourne `{"status":"ok"}`
- [ ] URL backend notée

### Frontend Vercel
- [ ] Projet créé avec Root Directory `frontend/`
- [ ] `VITE_API_URL` configurée avec URL backend réelle
- [ ] Build réussi ✅
- [ ] URL frontend notée

### Configuration Finale
- [ ] `FRONTEND_URL` backend mise à jour avec URL frontend réelle
- [ ] Backend redéployé
- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] Reset password fonctionne

---

## 🐛 Dépannage Rapide

### Erreur : "Failed to connect to database"
→ Vérifiez `DATABASE_URL` avec `?sslmode=require` à la fin

### Erreur : "CORS policy blocked"
→ Vérifiez que `FRONTEND_URL` dans le backend correspond EXACTEMENT à l'URL frontend

### Erreur : "Cannot find module '@prisma/client'"
→ Vérifiez que Build Command est : `npm ci && npx prisma generate`

### Erreur : "Email sending failed"
→ Vérifiez les variables EMAIL_* et l'App Password Gmail

---

## 🎉 Félicitations !

Votre application WIW-AE+ est maintenant en production ! 🚀

### URLs Importantes

- **Frontend Production** : https://votre-frontend.vercel.app
- **Backend API** : https://votre-backend.vercel.app/api
- **Neon Database** : https://console.neon.tech
- **Vercel Dashboard** : https://vercel.com/dashboard

### Prochaines Étapes

1. **Configurer un domaine personnalisé** (optionnel)
2. **Monitorer les logs** pour détecter les erreurs
3. **Créer le premier utilisateur admin**
4. **Importer les données de test** si nécessaire

Bon travail ! 💪
