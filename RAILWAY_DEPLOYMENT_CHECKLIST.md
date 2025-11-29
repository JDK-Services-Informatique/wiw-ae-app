# ✅ Checklist de Déploiement Railway - WIW-AE+

## 📋 Avant le Déploiement

### Code & Git
- [ ] Tous les changements sont committés
- [ ] Branch poussée sur GitHub
- [ ] Aucun credential dans le code
- [ ] `.env` et `.env.local` dans `.gitignore`

### Documentation
- [ ] README.md à jour
- [ ] SECURITY.md présent
- [ ] Variables d'environnement documentées

---

## 🚀 Déploiement Railway

### 1. Créer le Projet
- [ ] Compte Railway créé/connecté
- [ ] Nouveau projet créé sur Railway
- [ ] Repository GitHub connecté

### 2. Base de Données PostgreSQL
- [ ] Service PostgreSQL ajouté
- [ ] `DATABASE_URL` copiée
- [ ] Connexion testée

### 3. Backend - Variables d'Environnement

**Variables Obligatoires:**
- [ ] `NODE_ENV=production`
- [ ] `PORT=4000`
- [ ] `HOST=0.0.0.0`
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- [ ] `JWT_SECRET=<256-bit-secret>` ⚠️ GÉNÉRER AVEC CRYPTO
- [ ] `ALLOWED_ORIGINS=https://...` ⚠️ DOMAINE FRONTEND
- [ ] `FRONTEND_URL=https://...` ⚠️ DOMAINE FRONTEND

**Variables Email (pour reset password):**
- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_SECURE=false`
- [ ] `EMAIL_USER=your-email@gmail.com`
- [ ] `EMAIL_PASSWORD=<app-password>` ⚠️ APP PASSWORD
- [ ] `EMAIL_FROM=noreply@wiw-ae-plus.com`

**Variables Rate Limiting:**
- [ ] `RATE_LIMIT_WINDOW_MS=900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS=100`

### 4. Backend - Configuration Service
- [ ] Root Directory: `backend`
- [ ] Build Command: (auto-détecté)
- [ ] Start Command: `npm start`
- [ ] Déploiement réussi
- [ ] Logs vérifiés (pas d'erreurs)

### 5. Backend - Tests Health
- [ ] Health endpoint: `GET /api/health` ✅ 200 OK
- [ ] Ready endpoint: `GET /api/ready` ✅ database connected
- [ ] URL backend notée: `https://_____.up.railway.app`

### 6. Frontend - Variables d'Environnement
- [ ] `VITE_API_URL=https://backend-url.up.railway.app/api`

### 7. Frontend - Configuration Service
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Start Command: (Dockerfile auto)
- [ ] Déploiement réussi
- [ ] Site accessible

### 8. CORS - Mise à Jour Backend
- [ ] Retour dans backend variables
- [ ] `ALLOWED_ORIGINS` mis à jour avec URL frontend réelle
- [ ] `FRONTEND_URL` mis à jour
- [ ] Backend redéployé

---

## 🧪 Tests Post-Déploiement

### Test 1: Page d'Accueil
- [ ] Frontend accessible
- [ ] Pas d'erreur console (F12)
- [ ] Pas d'erreur CORS

### Test 2: Inscription
- [ ] Formulaire d'inscription accessible
- [ ] Compte créé avec succès
- [ ] Validation du mot de passe (8 chars, maj, min, chiffre)
- [ ] Redirection après inscription

### Test 3: Connexion
- [ ] Login fonctionne
- [ ] Cookie JWT créé (F12 → Application → Cookies)
- [ ] Cookie a les flags: `HttpOnly`, `Secure`, `SameSite=Strict`
- [ ] Redirection vers dashboard

### Test 4: Reset Password
- [ ] "Mot de passe oublié" accessible
- [ ] Email envoyé (vérifier boîte mail)
- [ ] Lien de reset reçu
- [ ] Reset password fonctionne
- [ ] Login avec nouveau mot de passe OK

### Test 5: API Protégées
- [ ] Accès aux projets (après login)
- [ ] Création d'un projet test
- [ ] Données sauvegardées en base
- [ ] Déconnexion supprime le cookie

### Test 6: Rate Limiting
- [ ] Se déconnecter
- [ ] 5 tentatives login échouées
- [ ] 6ème tentative bloquée
- [ ] Message: "Trop de tentatives..."
- [ ] Attendre 15min OU tester avec autre IP

### Test 7: Sécurité
- [ ] HTTPS actif (cadenas navigateur)
- [ ] Headers de sécurité (F12 → Network → Headers):
  - [ ] `Strict-Transport-Security`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: DENY`
  - [ ] `Content-Security-Policy`
- [ ] Pas de `X-Powered-By` révélé

### Test 8: Performances
- [ ] Page se charge < 3s
- [ ] API répond < 500ms
- [ ] Pas de timeout

---

## 🔒 Sécurité Production

### Variables Sensibles
- [ ] `JWT_SECRET` différent de dev
- [ ] Credentials email sécurisés (App Password)
- [ ] Aucun credential dans git history
- [ ] `.env.example` ne contient que des placeholders

### CORS
- [ ] Pas de wildcard (`*`) dans `ALLOWED_ORIGINS`
- [ ] Uniquement domaines de production listés
- [ ] Pas de `CORS_ALLOW_ALL=true` en prod

### Base de Données
- [ ] Credentials complexes
- [ ] Backups activés (Railway Settings)
- [ ] Connexion SSL active
- [ ] Pas d'accès public direct

### Monitoring
- [ ] Logs Railway configurés
- [ ] Alertes erreurs actives
- [ ] Métriques CPU/RAM surveillées

---

## 📊 Métriques à Surveiller

### Après 24h
- [ ] Nombre d'inscriptions
- [ ] Taux d'erreur < 1%
- [ ] Temps de réponse API < 500ms
- [ ] Uptime > 99%

### Après 1 semaine
- [ ] Aucune faille de sécurité reportée
- [ ] Emails envoyés avec succès (reset password)
- [ ] Rate limiting efficace (tentatives brute force bloquées)
- [ ] Base de données stable

---

## 🆘 En Cas de Problème

### Backend ne démarre pas
1. Vérifier logs Railway
2. Vérifier toutes variables d'environnement
3. Vérifier connexion PostgreSQL
4. Redéployer

### Frontend erreur CORS
1. Vérifier `ALLOWED_ORIGINS` backend
2. Vérifier `VITE_API_URL` frontend
3. Pas de slash final dans les URLs
4. Redéployer backend

### Emails non reçus
1. Vérifier variables `EMAIL_*`
2. Tester SMTP credentials
3. Vérifier dossier spam
4. Logs backend: chercher "Email envoyé"

### Rate limiting trop strict
1. Ajuster `RATE_LIMIT_MAX_REQUESTS`
2. Ajuster `RATE_LIMIT_WINDOW_MS`
3. Redéployer backend

---

## 🎯 Commandes Rapides

### Générer JWT Secret (local)
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Tester Health Check
```bash
curl https://your-backend.up.railway.app/api/health
```

### Tester Database
```bash
curl https://your-backend.up.railway.app/api/ready
```

### Voir Logs en Temps Réel (Railway CLI)
```bash
railway logs
```

### Redéployer
```bash
railway up
```

---

## ✅ Validation Finale

- [ ] Frontend accessible publiquement
- [ ] Backend API répond correctement
- [ ] Toutes les fonctionnalités testées
- [ ] Aucune erreur dans les logs
- [ ] Sécurité validée
- [ ] Performances acceptables
- [ ] Monitoring actif
- [ ] Backups configurés
- [ ] Documentation à jour
- [ ] Équipe informée des URLs

---

## 🎉 Déploiement Terminé !

**URLs de Production:**
- Frontend: `https://_____.up.railway.app`
- Backend: `https://_____.up.railway.app`
- Health: `https://_____.up.railway.app/api/health`

**Prochaines Étapes:**
1. Configurer domaine personnalisé (optionnel)
2. Activer monitoring avancé (Sentry)
3. Planifier tests de charge
4. Configurer CI/CD pour déploiements automatiques
5. Former l'équipe

---

**Date de déploiement:** _____
**Déployé par:** _____
**Version:** 0.2.0
