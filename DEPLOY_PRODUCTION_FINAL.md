# 🚀 Déploiement Production WIW-AE+ - Guide Final

Guide complet pour déployer WIW-AE+ en production avec domaines personnalisés.

---

## 🌐 Architecture Production

```
┌─────────────────────────────────────────┐
│  Domaines Secondaires (.fr, .net)       │
│  https://wiw-ae-plus.fr                 │
│  https://wiw-ae-plus.net                │
└───────────────┬──────────────────────────┘
                │ Redirection 301
                ↓
┌─────────────────────────────────────────┐
│  Frontend Principal                      │
│  https://wiw-ae-plus.com                │
│  (Vercel Static Hosting)                 │
└───────────────┬──────────────────────────┘
                │ API Calls
                ↓
┌─────────────────────────────────────────┐
│  Backend API                             │
│  https://api.wiw-ae-plus.com            │
│  (Vercel Serverless Functions)           │
└───────────────┬──────────────────────────┘
                │ PostgreSQL
                ↓
┌─────────────────────────────────────────┐
│  Neon PostgreSQL                         │
│  (Serverless Database)                   │
└─────────────────────────────────────────┘
```

---

## 📋 Prérequis

### ✅ Comptes Nécessaires
- [ ] Compte Vercel : https://vercel.com
- [ ] Compte Neon : https://neon.tech
- [ ] Compte Gmail (pour emails)
- [ ] Accès aux DNS de vos domaines

### ✅ Domaines Disponibles
- [ ] wiw-ae-plus.com
- [ ] wiw-ae-plus.fr
- [ ] wiw-ae-plus.net

### ✅ Informations à Préparer
- [ ] Connection string Neon PostgreSQL
- [ ] App Password Gmail (16 caractères)
- [ ] Accès aux paramètres DNS de vos domaines

---

## 🎯 Étape 1 : Backend API (api.wiw-ae-plus.com)

### 1.1 Créer le Projet Vercel

1. **Accédez** : https://vercel.com/new
2. **Import Repository** : `JDK-Services-Informatique/wiw-ae-app`
3. **Configurez** :
   ```
   Project Name: wiw-ae-backend
   Root Directory: backend/
   Framework Preset: Other
   Build Command: npm run build
   Output Directory: (laisser vide)
   Install Command: npm install
   ```

### 1.2 Ajouter les Environment Variables

Dans **Settings** → **Environment Variables**, ajoutez **UNE PAR UNE** :

#### 1. DATABASE_URL
```bash
postgresql://neondb_owner:xxxxx@ep-xxxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```
⚠️ Votre connection string Neon complète

#### 2. JWT_SECRET
```bash
70d3e1d96841c6cbb722912a66752722d089e509f9f06069ad5226ce396bad92
```

#### 3. ALLOWED_ORIGINS
```bash
https://wiw-ae-plus.com,https://www.wiw-ae-plus.com,https://wiw-ae-plus.fr,https://www.wiw-ae-plus.fr,https://wiw-ae-plus.net,https://www.wiw-ae-plus.net
```
⚠️ Important : tous les domaines séparés par des virgules, SANS espaces

#### 4. FRONTEND_URL
```bash
https://wiw-ae-plus.com
```

#### 5. EMAIL_HOST
```bash
smtp.gmail.com
```

#### 6. EMAIL_PORT
```bash
587
```

#### 7. EMAIL_USER
```bash
votre-email@gmail.com
```
⚠️ Votre adresse Gmail complète

#### 8. EMAIL_PASSWORD
```bash
votre-app-password-16-chars
```
⚠️ App Password Gmail (voir section ci-dessous)

**Comment obtenir App Password Gmail** :
1. https://myaccount.google.com/apppasswords
2. Créer pour "Mail"
3. Nommer : `WIW-AE Backend`
4. Copier les 16 caractères (sans espaces)

#### 9. EMAIL_FROM
```bash
noreply@wiw-ae-plus.com
```

#### 10. NODE_ENV
```bash
production
```

### 1.3 Déployer le Backend

1. **Cliquez** sur **"Deploy"** 🚀
2. **Attendez** 2-3 minutes
3. **Notez l'URL Vercel** (ex: `wiw-ae-backend-xxx.vercel.app`)

### 1.4 Ajouter le Domaine Personnalisé

1. **Backend Project** → **Settings** → **Domains**
2. **Add Domain** : `api.wiw-ae-plus.com`
3. Vercel vous donne un **CNAME** (ex: `cname.vercel-dns.com`)

### 1.5 Configurer DNS pour api.wiw-ae-plus.com

Chez votre registrar DNS, ajoutez :
```
Type: CNAME
Name: api
Target: cname.vercel-dns.com.  (fourni par Vercel)
TTL: Auto
```

### 1.6 Attendre la Propagation DNS

⏱️ Peut prendre 5 minutes à 24 heures (généralement 15 minutes).

### 1.7 Tester l'API

```bash
curl https://api.wiw-ae-plus.com/api/health
```

**Résultat attendu** :
```json
{"status":"ok","database":"connected"}
```

---

## 🎨 Étape 2 : Frontend (wiw-ae-plus.com)

### 2.1 Créer le Projet Vercel

1. **Retournez** : https://vercel.com/new
2. **Import Repository** : `JDK-Services-Informatique/wiw-ae-app` (encore)
3. **Configurez** :
   ```
   Project Name: wiw-ae-frontend
   Root Directory: frontend/
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### 2.2 Ajouter l'Environment Variable

Dans **Settings** → **Environment Variables** :

```bash
VITE_API_URL=https://api.wiw-ae-plus.com/api
```
⚠️ N'oubliez pas `/api` à la fin !

### 2.3 Déployer le Frontend

1. **Cliquez** sur **"Deploy"** 🚀
2. **Attendez** 2-3 minutes
3. **Notez l'URL Vercel** (ex: `wiw-ae-frontend-xxx.vercel.app`)

### 2.4 Ajouter les Domaines Personnalisés

1. **Frontend Project** → **Settings** → **Domains**
2. **Add Domain** : `wiw-ae-plus.com`
3. **Add Domain** : `www.wiw-ae-plus.com` → Sélectionnez **"Redirect to wiw-ae-plus.com"**

### 2.5 Configurer DNS pour wiw-ae-plus.com

Chez votre registrar DNS :

#### Pour le domaine apex (@)
```
Type: A
Name: @
Target: 76.76.21.21  (IP Vercel)
TTL: Auto
```

#### Pour www
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com.  (fourni par Vercel)
TTL: Auto
```

### 2.6 Attendre la Propagation DNS

⏱️ Peut prendre 5 minutes à 24 heures.

### 2.7 Tester le Frontend

Ouvrez : https://wiw-ae-plus.com

✅ La page doit s'afficher correctement

---

## 🔀 Étape 3 : Redirections (.fr et .net)

### Option A : Redirection DNS Native (Recommandé)

Si votre registrar supporte les redirections HTTP :

#### Pour wiw-ae-plus.fr
1. **Panneau DNS** de votre registrar
2. **Activer la redirection** : `wiw-ae-plus.fr` → `https://wiw-ae-plus.com`
3. **Type** : 301 Permanent
4. **Inclure** : `www.wiw-ae-plus.fr` → `https://wiw-ae-plus.com`

#### Pour wiw-ae-plus.net
1. **Activer la redirection** : `wiw-ae-plus.net` → `https://wiw-ae-plus.com`
2. **Type** : 301 Permanent
3. **Inclure** : `www.wiw-ae-plus.net` → `https://wiw-ae-plus.com`

✅ **Terminé** ! Passez à l'Étape 4.

---

### Option B : Via Vercel (Si pas de redirection DNS native)

#### 3.1 Créer le Projet Vercel de Redirection

1. **Accédez** : https://vercel.com/new
2. **Import Repository** : `JDK-Services-Informatique/wiw-ae-app`
3. **Configurez** :
   ```
   Project Name: wiw-ae-redirects
   Root Directory: vercel-redirects/
   Framework Preset: Other
   Build Command: npm run build
   ```

#### 3.2 Ajouter les Domaines

Dans **Settings** → **Domains**, ajoutez :
- `wiw-ae-plus.fr`
- `www.wiw-ae-plus.fr`
- `wiw-ae-plus.net`
- `www.wiw-ae-plus.net`

#### 3.3 Configurer DNS pour .fr et .net

Pour chaque domaine (.fr et .net) :

**Apex domain** :
```
Type: A
Name: @
Target: 76.76.21.21
```

**www** :
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com.
```

#### 3.4 Tester les Redirections

```bash
curl -I https://wiw-ae-plus.fr
# Doit retourner : 301 Moved Permanently
# Location: https://wiw-ae-plus.com/
```

---

## 🧪 Étape 4 : Tests Finaux

### Test 1 : API Health Check
```bash
curl https://api.wiw-ae-plus.com/api/health
```
✅ Résultat attendu : `{"status":"ok","database":"connected"}`

### Test 2 : Accès Frontend
Ouvrez : https://wiw-ae-plus.com

✅ Page doit se charger sans erreur

### Test 3 : CORS
1. Ouvrez le frontend dans Chrome
2. Ouvrez **DevTools** (F12) → **Network**
3. Testez une inscription ou login
4. Vérifiez qu'il n'y a pas d'erreur CORS

### Test 4 : Inscription
1. Cliquez sur "S'inscrire"
2. Remplissez le formulaire :
   - Nom : Test
   - Prénom : Utilisateur
   - Email : test@wiw-ae-plus.com
   - Mot de passe : Test123456!
3. Validez

✅ **Résultat attendu** :
- Inscription réussie
- Redirection vers dashboard
- Toast de confirmation

### Test 5 : Reset Password
1. Cliquez sur "Mot de passe oublié ?"
2. Entrez votre email
3. Vérifiez votre boîte mail
4. Cliquez sur le lien reçu
5. Changez le mot de passe

✅ **Résultat attendu** :
- Email reçu dans les 2 minutes
- Reset fonctionnel

### Test 6 : Redirections
```bash
# Test .fr
curl -I https://wiw-ae-plus.fr
# Doit rediriger vers https://wiw-ae-plus.com

# Test .net
curl -I https://wiw-ae-plus.net
# Doit rediriger vers https://wiw-ae-plus.com
```

---

## ✅ Checklist Complète

### Backend API (api.wiw-ae-plus.com)
- [ ] Projet Vercel créé avec Root Directory `backend/`
- [ ] 10 environment variables configurées
- [ ] Build réussi ✅
- [ ] Domaine `api.wiw-ae-plus.com` ajouté
- [ ] DNS CNAME configuré
- [ ] SSL/TLS vérifié ✅
- [ ] `/api/health` retourne OK

### Frontend (wiw-ae-plus.com)
- [ ] Projet Vercel créé avec Root Directory `frontend/`
- [ ] `VITE_API_URL` configuré
- [ ] Build réussi ✅
- [ ] Domaine `wiw-ae-plus.com` ajouté
- [ ] Domaine `www.wiw-ae-plus.com` ajouté (redirect)
- [ ] DNS A et CNAME configurés
- [ ] SSL/TLS vérifié ✅
- [ ] Page s'affiche correctement

### Redirections (.fr et .net)
- [ ] Redirections configurées (DNS ou Vercel)
- [ ] DNS configuré pour .fr et .net
- [ ] SSL/TLS vérifié ✅
- [ ] Test redirection .fr → .com fonctionne
- [ ] Test redirection .net → .com fonctionne

### Tests Complets
- [ ] API health check OK
- [ ] Frontend accessible
- [ ] Pas d'erreur CORS
- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] Reset password fonctionne (email reçu)
- [ ] Redirections .fr et .net fonctionnent

---

## 📊 Résumé Configuration

### URLs Production
```
Frontend Principal : https://wiw-ae-plus.com
Backend API        : https://api.wiw-ae-plus.com/api
Redirections       : .fr et .net → .com
```

### Variables d'Environnement

**Backend (10 variables)** :
```bash
DATABASE_URL=postgresql://...neon.tech/...?sslmode=require
JWT_SECRET=70d3e1d96841c6cbb722912a66752722...
ALLOWED_ORIGINS=https://wiw-ae-plus.com,https://www.wiw-ae-plus.com,...
FRONTEND_URL=https://wiw-ae-plus.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=app-password-16-chars
EMAIL_FROM=noreply@wiw-ae-plus.com
NODE_ENV=production
```

**Frontend (1 variable)** :
```bash
VITE_API_URL=https://api.wiw-ae-plus.com/api
```

### DNS Records

**api.wiw-ae-plus.com** :
```
CNAME: api → cname.vercel-dns.com.
```

**wiw-ae-plus.com** :
```
A: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com.
```

**wiw-ae-plus.fr et .net** (si Option B) :
```
A: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com.
```

---

## 🐛 Dépannage

### Erreur : "This domain is not verified"
→ Attendez quelques minutes pour la propagation DNS

### Erreur : "CORS policy blocked"
→ Vérifiez que `ALLOWED_ORIGINS` contient TOUS vos domaines (avec et sans www)

### Erreur : "Failed to connect to database"
→ Vérifiez que `DATABASE_URL` se termine par `?sslmode=require`

### Redirections ne fonctionnent pas
→ Vérifiez la propagation DNS : `dig wiw-ae-plus.fr`

---

## 📚 Documentation

- **Configuration Domaines** : `DOMAINES_CONFIG.md`
- **Guide Vercel Complet** : `DEPLOY_VERCEL_FINAL.md`
- **Redirections** : `vercel-redirects/README.md`
- **Scripts Tests** : `backend/scripts/`

---

## 🎉 Félicitations !

Votre application WIW-AE+ est maintenant en production ! 🚀

### Prochaines Étapes

1. **Monitoring** : Configurez des alertes Vercel
2. **Analytics** : Ajoutez Google Analytics ou Plausible
3. **SEO** : Configurez SPF, DKIM, DMARC pour les emails
4. **Backups** : Configurez les backups automatiques Neon
5. **Documentation** : Créez un guide utilisateur

Bon lancement ! 💪
