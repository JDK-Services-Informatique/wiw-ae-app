# 🚀 Démarrage Rapide Railway - WIW-AE+ v0.2.0

Guide ultra-rapide pour déployer WIW-AE+ sur Railway en 15 minutes.

## ⚡ Prérequis (5 min)

1. **Compte Railway:** https://railway.app (connexion GitHub)
2. **Compte Email SMTP:**
   - Gmail: Créer un App Password → https://myaccount.google.com/apppasswords
   - OU SendGrid gratuit → https://signup.sendgrid.com/

## 🎯 Déploiement (10 min)

### Étape 1: Créer le Projet (1 min)

```bash
1. Railway.app → "New Project"
2. "Deploy from GitHub repo"
3. Sélectionner: wiw-ae-app
```

### Étape 2: PostgreSQL (1 min)

```bash
1. "+ New" → "Database" → "PostgreSQL"
2. Copier DATABASE_URL (on l'utilisera après)
```

### Étape 3: Backend (4 min)

```bash
1. "+ New" → "GitHub Repo" → wiw-ae-app
2. Settings:
   - Root Directory: backend
   - Start Command: npm start
3. Variables → Ajouter:
```

**Copier-coller ces variables et remplacer les valeurs:**

```env
NODE_ENV=production
PORT=4000
HOST=0.0.0.0
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<GÉNÉRER CI-DESSOUS>
ALLOWED_ORIGINS=<URL FRONTEND - ATTENDRE ÉTAPE 4>
FRONTEND_URL=<URL FRONTEND - ATTENDRE ÉTAPE 4>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=<VOTRE APP PASSWORD GMAIL>
EMAIL_FROM=noreply@wiw-ae-plus.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Générer JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copier le résultat dans `JWT_SECRET`

**Laisser vide pour l'instant:** `ALLOWED_ORIGINS` et `FRONTEND_URL`

```bash
4. Deploy (attendre 2-3 min)
5. Copier l'URL backend: https://xxxxx.up.railway.app
```

### Étape 4: Frontend (2 min)

```bash
1. "+ New" → "GitHub Repo" → wiw-ae-app
2. Settings:
   - Root Directory: frontend
   - Build Command: npm run build
3. Variables → Ajouter:
```

```env
VITE_API_URL=https://BACKEND-URL.up.railway.app/api
```

Remplacer `BACKEND-URL` par l'URL du backend (étape 3.5)

```bash
4. Deploy (attendre 3-4 min)
5. Copier l'URL frontend: https://yyyyy.up.railway.app
```

### Étape 5: CORS Backend (2 min)

```bash
1. Retourner au service Backend
2. Variables → Modifier:
   - ALLOWED_ORIGINS=https://yyyyy.up.railway.app
   - FRONTEND_URL=https://yyyyy.up.railway.app
3. Redeploy (bouton "Redeploy" ou attendre auto-redeploy)
```

## ✅ Tests (5 min)

### Test 1: Health Check
```bash
curl https://BACKEND-URL.up.railway.app/api/health
# Doit retourner: {"status":"ok",...}
```

### Test 2: Frontend
```
Ouvrir: https://FRONTEND-URL.up.railway.app
✓ Page s'affiche
✓ Pas d'erreur console (F12)
```

### Test 3: Inscription
```
1. Créer un compte test
2. Vérifier que ça fonctionne
```

### Test 4: Reset Password
```
1. "Mot de passe oublié"
2. Entrer email
3. Vérifier email reçu (spam si Gmail)
4. Cliquer lien et reset
```

## 🔥 Si Problème

### Backend ne démarre pas
```bash
Railway → Service Backend → Logs
# Chercher l'erreur et vérifier les variables
```

### Erreur CORS
```bash
# Vérifier:
1. ALLOWED_ORIGINS sans slash final
2. ALLOWED_ORIGINS = FRONTEND_URL
3. Backend redéployé après modification
```

### Email non reçu
```bash
# Gmail:
1. Vérifier App Password (16 chars)
2. Vérifier spam
3. Logs backend: chercher "Email envoyé"
```

## 📊 Variables Rapides

**Backend minimum:**
```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<64-chars-random>
ALLOWED_ORIGINS=https://frontend.up.railway.app
FRONTEND_URL=https://frontend.up.railway.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=email@gmail.com
EMAIL_PASSWORD=<app-password>
EMAIL_FROM=noreply@app.com
```

**Frontend:**
```env
VITE_API_URL=https://backend.up.railway.app/api
```

## 🎉 C'est Fait !

**URLs:**
- Frontend: https://your-frontend.up.railway.app
- Backend: https://your-backend.up.railway.app/api

**Prochaines étapes:**
- [ ] Configurer domaine personnalisé
- [ ] Activer backups PostgreSQL
- [ ] Surveiller logs

---

**Aide complète:** [DEPLOY_PRODUCTION_RAILWAY.md](./DEPLOY_PRODUCTION_RAILWAY.md)
**Checklist:** [RAILWAY_DEPLOYMENT_CHECKLIST.md](./RAILWAY_DEPLOYMENT_CHECKLIST.md)
