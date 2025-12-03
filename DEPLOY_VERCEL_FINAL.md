# 🚀 Guide Déploiement Vercel - Configuration Finale

✅ **Statut Actuel** : Backend configuré avec Neon PostgreSQL

---

## 📋 Récapitulatif Configuration

### ✅ Ce qui est PRÊT

1. **Backend** :
   - ✅ Script `build` ajouté (prisma generate)
   - ✅ Configuration Vercel dans `backend/vercel.json`
   - ✅ Serveur Express exporté pour Vercel serverless
   - ✅ Base de données Neon configurée
   - ✅ JWT_SECRET généré : `70d3e1d96841c6cbb722912a66752722d089e509f9f06069ad5226ce396bad92`

2. **Frontend** :
   - ✅ Build Vite fonctionnel
   - ✅ Configuration API dans `src/config.js`
   - ✅ Prêt pour déploiement statique

3. **Documentation** :
   - ✅ Guides complets créés
   - ✅ Scripts de test disponibles
   - ✅ Checklist de déploiement

---

## 🎯 Déploiement Backend sur Vercel

### Étape 1 : Créer le Projet Vercel

1. **Accédez** : https://vercel.com/new
2. **Import Repository** : Sélectionnez `JDK-Services-Informatique/wiw-ae-app`
3. **Configurez le projet** :

```
Project Name:       wiw-ae-backend
Framework Preset:   Other
Root Directory:     backend/        ← CRITIQUE !
Build Command:      npm run build
Output Directory:   (laisser vide)
Install Command:    npm install
```

### Étape 2 : Ajouter Environment Variables

Dans **Settings** → **Environment Variables**, ajoutez **UNE PAR UNE** :

#### Base de données Neon
```bash
DATABASE_URL
```
**Value** : Votre connection string Neon complète
```
postgresql://neondb_owner:xxxxx@ep-xxxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```
⚠️ Assurez-vous qu'elle se termine par `?sslmode=require`

#### JWT Secret
```bash
JWT_SECRET
```
**Value** :
```
70d3e1d96841c6cbb722912a66752722d089e509f9f06069ad5226ce396bad92
```

#### Configuration Email Gmail
```bash
EMAIL_HOST
```
**Value** : `smtp.gmail.com`

```bash
EMAIL_PORT
```
**Value** : `587`

```bash
EMAIL_USER
```
**Value** : Votre adresse Gmail complète (ex: `votre-email@gmail.com`)

```bash
EMAIL_PASSWORD
```
**Value** : Votre App Password Gmail (16 caractères sans espaces)

📝 **Comment obtenir App Password Gmail** :
1. https://myaccount.google.com/apppasswords
2. Sélectionnez "Mail" / "Autre"
3. Nommez : `WIW-AE Backend`
4. Copiez le mot de passe généré (16 caractères)

```bash
EMAIL_FROM
```
**Value** : `noreply@wiw-ae.com` (ou votre domaine)

#### Frontend URL (provisoire)
```bash
FRONTEND_URL
```
**Value** : `https://wiw-ae-frontend.vercel.app`
⚠️ On mettra à jour après le déploiement du frontend

#### Node Environment
```bash
NODE_ENV
```
**Value** : `production`

### Étape 3 : Déployer le Backend

1. **Cliquez** sur **"Deploy"** 🚀
2. **Attendez** le build (2-3 minutes)
3. **Notez l'URL** générée (ex: `https://wiw-ae-backend-xxx.vercel.app`)

### Étape 4 : Tester l'API Backend

```bash
# Testez le endpoint health
curl https://votre-backend-url.vercel.app/api/health

# Résultat attendu
{"status":"ok","database":"connected"}
```

Si erreur, consultez :
- **Vercel Dashboard** → **Deployments** → **Dernier déploiement** → **View Function Logs**

---

## 🎨 Déploiement Frontend sur Vercel

### Étape 1 : Créer le Projet Frontend

1. **Retournez** à : https://vercel.com/new
2. **Import Repository** : Sélectionnez `JDK-Services-Informatique/wiw-ae-app` (encore)
3. **Configurez le projet** :

```
Project Name:       wiw-ae-frontend
Framework Preset:   Vite
Root Directory:     frontend/       ← CRITIQUE !
Build Command:      npm run build
Output Directory:   dist
Install Command:    npm install
```

### Étape 2 : Ajouter Environment Variable

Dans **Settings** → **Environment Variables** :

```bash
VITE_API_URL
```
**Value** : URL de votre backend (notée à l'étape Backend)
```
https://wiw-ae-backend-xxx.vercel.app/api
```
⚠️ **Important** : N'oubliez pas `/api` à la fin !

### Étape 3 : Déployer le Frontend

1. **Cliquez** sur **"Deploy"** 🚀
2. **Attendez** le build (2-3 minutes)
3. **Notez l'URL** générée (ex: `https://wiw-ae-frontend-xxx.vercel.app`)

---

## 🔗 Configuration CORS Finale

Maintenant que le frontend est déployé, mettez à jour le CORS du backend :

### Étape 1 : Mettre à Jour FRONTEND_URL

1. **Backend Vercel Project** → **Settings** → **Environment Variables**
2. **Trouvez** `FRONTEND_URL`
3. **Cliquez** sur **Edit** (crayon)
4. **Remplacez** par l'URL réelle du frontend :
   ```
   https://wiw-ae-frontend-xxx.vercel.app
   ```
   ⚠️ Utilisez l'URL EXACTE (sans slash final)
5. **Sauvegardez**

### Étape 2 : Redéployer le Backend

1. **Backend Vercel Project** → **Deployments**
2. **Dernier déploiement** → **⋯** (trois points)
3. **Cliquez** sur **"Redeploy"**
4. **Confirmez** le redéploiement

---

## ✅ Tests Finaux

### Test 1 : Accès Frontend
```
https://votre-frontend.vercel.app
```
✅ Page doit s'afficher correctement

### Test 2 : API Health Check
```bash
curl https://votre-backend.vercel.app/api/health
```
✅ Doit retourner : `{"status":"ok","database":"connected"}`

### Test 3 : Inscription
1. Ouvrez le frontend
2. Cliquez sur "S'inscrire"
3. Remplissez le formulaire :
   - Nom : Test
   - Prénom : Utilisateur
   - Email : test@example.com
   - Mot de passe : Test123456!
4. Validez

✅ **Résultat attendu** :
- Inscription réussie
- Redirection vers le dashboard
- Toast de confirmation

### Test 4 : Reset Password
1. Cliquez sur "Mot de passe oublié ?"
2. Entrez votre email
3. Vérifiez votre boîte mail
4. Cliquez sur le lien reçu
5. Changez le mot de passe

✅ **Résultat attendu** :
- Email reçu dans les 2 minutes
- Reset fonctionnel

---

## 🐛 Dépannage

### Erreur : "Failed to connect to database"
**Solutions** :
1. Vérifiez que `DATABASE_URL` contient `?sslmode=require`
2. Testez la connexion depuis Neon Console
3. Vérifiez que la base est active (pas en veille)

### Erreur : "CORS policy blocked"
**Solutions** :
1. Vérifiez que `FRONTEND_URL` dans backend = URL frontend EXACTE
2. Pas de slash `/` à la fin de FRONTEND_URL
3. Redéployez le backend après modification

### Erreur : "Cannot find module '@prisma/client'"
**Solutions** :
1. Vérifiez que Build Command est `npm run build`
2. Backend → Settings → General → Build & Development Settings
3. Le script doit contenir `prisma generate`

### Erreur : "Email sending failed"
**Solutions** :
1. Vérifiez les 5 variables EMAIL_*
2. Testez l'App Password Gmail
3. Vérifiez que la validation en 2 étapes est activée sur Gmail

---

## 📊 Architecture Finale

```
┌─────────────────────────────────────────┐
│  Frontend Vercel (Vite Static)          │
│  https://wiw-ae-frontend-xxx.vercel.app │
│                                          │
│  Environment Variables:                  │
│  - VITE_API_URL                          │
└───────────────┬──────────────────────────┘
                │ HTTP/REST API
                ↓
┌─────────────────────────────────────────┐
│  Backend Vercel (Serverless Functions)  │
│  https://wiw-ae-backend-xxx.vercel.app  │
│                                          │
│  Environment Variables:                  │
│  - DATABASE_URL                          │
│  - JWT_SECRET                            │
│  - EMAIL_HOST, EMAIL_PORT, etc.          │
│  - FRONTEND_URL                          │
│  - NODE_ENV                              │
└───────────────┬──────────────────────────┘
                │ PostgreSQL
                ↓
┌─────────────────────────────────────────┐
│  Neon PostgreSQL (Serverless Database)  │
│  ep-xxxxx.eu-central-1.aws.neon.tech    │
└─────────────────────────────────────────┘
```

---

## 🎉 Checklist Finale

### Backend Vercel
- [ ] Projet créé avec Root Directory `backend/`
- [ ] `DATABASE_URL` configurée (Neon)
- [ ] `JWT_SECRET` configuré (70d3e1d96841c6cbb722912a66752722...)
- [ ] Variables `EMAIL_*` configurées (5 variables)
- [ ] `FRONTEND_URL` configurée (provisoire puis mise à jour)
- [ ] `NODE_ENV=production` configuré
- [ ] Build réussi ✅
- [ ] `/api/health` retourne `{"status":"ok"}`
- [ ] URL backend notée

### Frontend Vercel
- [ ] Projet créé avec Root Directory `frontend/`
- [ ] `VITE_API_URL` configurée avec URL backend réelle + `/api`
- [ ] Build réussi ✅
- [ ] Page accessible
- [ ] URL frontend notée

### Configuration Finale
- [ ] `FRONTEND_URL` backend mise à jour avec URL frontend réelle
- [ ] Backend redéployé après mise à jour CORS
- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] Reset password fonctionne (email reçu)

---

## 🎯 Résumé Variables d'Environnement

### Backend (7 variables)
```bash
DATABASE_URL=postgresql://neondb_owner:xxx@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=70d3e1d96841c6cbb722912a66752722d089e509f9f06069ad5226ce396bad92
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-app-password-16-chars
EMAIL_FROM=noreply@wiw-ae.com
FRONTEND_URL=https://wiw-ae-frontend-xxx.vercel.app  ← Mettre à jour après frontend
NODE_ENV=production
```

### Frontend (1 variable)
```bash
VITE_API_URL=https://wiw-ae-backend-xxx.vercel.app/api  ← Avec /api !
```

---

## 📚 Documentation Complète

- **DEPLOYMENT_CHECKLIST.md** : Guide pas-à-pas détaillé
- **VERCEL_CONFIG_NOTES.md** : Explications configuration
- **QUICKSTART_NEON_VERCEL.md** : Guide rapide
- **backend/scripts/test-neon-connection.js** : Test connexion Neon

---

## 🚀 Prêt pour le Déploiement !

Tout est configuré. Suivez les étapes ci-dessus dans l'ordre :
1. ✅ Backend Vercel → Ajouter variables → Deploy
2. ✅ Frontend Vercel → Ajouter variable → Deploy
3. ✅ Mettre à jour CORS → Redeploy backend
4. ✅ Tester l'application complète

**Bonne chance ! 🎉**
