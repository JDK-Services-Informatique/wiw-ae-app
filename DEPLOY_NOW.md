# 🚀 DÉPLOYER MAINTENANT - Guide Pas-à-Pas

Guide ultra-détaillé pour déployer WIW-AE+ en production **maintenant**.

⏱️ **Temps total estimé** : 50 minutes

---

## 🎯 ÉTAPE PRÉLIMINAIRE : Créer App Password Gmail (5 min)

### Actions à faire MAINTENANT :

1. **Ouvrez** dans un nouvel onglet : https://myaccount.google.com/apppasswords

2. **Si vous voyez "Cette page n'est pas disponible"** :
   - Allez dans https://myaccount.google.com/security
   - Activez la "Validation en deux étapes" (obligatoire)
   - Retournez sur https://myaccount.google.com/apppasswords

3. **Créez le mot de passe d'application** :
   - Sélectionnez l'application : **Mail**
   - Sélectionnez l'appareil : **Autre (nom personnalisé)**
   - Tapez : `WIW-AE Backend`
   - Cliquez sur **Générer**

4. **Copiez le mot de passe** :
   ```
   Exemple : abcd efgh ijkl mnop
   ```
   ⚠️ **Copiez SANS les espaces** : `abcdefghijklmnop`

5. **Gardez cet onglet ouvert**, vous en aurez besoin dans 5 minutes.

✅ **Checkpoint** : Vous avez votre App Password Gmail de 16 caractères.

---

## 🔧 ÉTAPE 1 : Déployer le Backend (20 min)

### 1.1 Créer le Projet Vercel

1. **Ouvrez** : https://vercel.com/new

2. **Si pas encore connecté** :
   - Connectez-vous avec GitHub
   - Autorisez Vercel à accéder à vos repositories

3. **Import Git Repository** :
   - Cherchez `JDK-Services-Informatique/wiw-ae-app`
   - Cliquez sur **Import**

4. **Configure Project** :
   ```
   Project Name: wiw-ae-backend

   Framework Preset: Other

   Root Directory: backend/     ← Cliquez sur "Edit" et tapez "backend/"

   Build Command: npm run build

   Output Directory: (laisser vide)

   Install Command: npm install
   ```

5. **⚠️ NE CLIQUEZ PAS ENCORE SUR "DEPLOY" !**

### 1.2 Ajouter les Environment Variables

**Avant de déployer**, configurez les variables :

1. **Déroulez** la section **"Environment Variables"** (juste au-dessus du bouton Deploy)

2. **Ajoutez ces 10 variables UNE PAR UNE** :

#### Variable 1 : DATABASE_URL
```
Key: DATABASE_URL
Value: [Votre connection string Neon complète]
```
**Où la trouver ?**
- Ouvrez : https://console.neon.tech
- Cliquez sur votre projet `wiw-ae-production`
- Section "Connection Details"
- Copiez la "Connection string"
- ⚠️ Doit se terminer par `?sslmode=require`

#### Variable 2 : JWT_SECRET
```
Key: JWT_SECRET
Value: 70d3e1d96841c6cbb722912a66752722d089e509f9f06069ad5226ce396bad92
```

#### Variable 3 : ALLOWED_ORIGINS
```
Key: ALLOWED_ORIGINS
Value: https://wiw-ae-plus.com,https://www.wiw-ae-plus.com,https://wiw-ae-plus.fr,https://www.wiw-ae-plus.fr,https://wiw-ae-plus.net,https://www.wiw-ae-plus.net
```
⚠️ **Tout sur une seule ligne, SANS espaces après les virgules**

#### Variable 4 : FRONTEND_URL
```
Key: FRONTEND_URL
Value: https://wiw-ae-plus.com
```

#### Variable 5 : EMAIL_HOST
```
Key: EMAIL_HOST
Value: smtp.gmail.com
```

#### Variable 6 : EMAIL_PORT
```
Key: EMAIL_PORT
Value: 587
```

#### Variable 7 : EMAIL_USER
```
Key: EMAIL_USER
Value: [Votre adresse Gmail complète]
```
Exemple : `contact@votredomaine.com` ou `votre-email@gmail.com`

#### Variable 8 : EMAIL_PASSWORD
```
Key: EMAIL_PASSWORD
Value: [App Password Gmail de l'étape préliminaire]
```
⚠️ Les 16 caractères SANS espaces que vous avez copiés

#### Variable 9 : EMAIL_FROM
```
Key: EMAIL_FROM
Value: noreply@wiw-ae-plus.com
```

#### Variable 10 : NODE_ENV
```
Key: NODE_ENV
Value: production
```

3. **Vérifiez** que vous avez bien **10 variables** ajoutées

### 1.3 Déployer le Backend

1. **Cliquez** sur **"Deploy"** 🚀

2. **Attendez** le build (2-3 minutes)
   - Vous verrez les logs défiler
   - Vous devriez voir "✓ Generated Prisma Client"
   - À la fin : "✓ Build Completed"

3. **Une fois déployé** :
   - Vous verrez une animation de confetti 🎉
   - Notez l'URL Vercel : `https://wiw-ae-backend-xxxxx.vercel.app`
   - **Copiez cette URL** dans un fichier texte (vous en aurez besoin)

✅ **Checkpoint** : Backend déployé sur Vercel avec URL temporaire.

### 1.4 Ajouter le Domaine Personnalisé

1. **Dans le projet backend**, cliquez sur **"Settings"** (en haut)

2. **Menu de gauche** → **"Domains"**

3. **Dans le champ "Enter domain"**, tapez :
   ```
   api.wiw-ae-plus.com
   ```

4. **Cliquez** sur **"Add"**

5. **Vercel va afficher** :
   ```
   ⚠️ Invalid Configuration

   Please configure your DNS with the following record:

   Type: CNAME
   Name: api
   Value: cname.vercel-dns.com.
   ```

6. **⚠️ IMPORTANT : Copiez cette valeur CNAME** (peut être différente)
   - Elle peut être `cname.vercel-dns.com.` ou `cname-xyz.vercel-dns.com.`
   - **Notez-la** dans votre fichier texte

### 1.5 Configurer DNS pour api.wiw-ae-plus.com

**Allez chez votre registrar de domaines** (OVH, Gandi, Cloudflare, etc.) :

1. **Accédez** à la gestion DNS de `wiw-ae-plus.com`

2. **Ajoutez un enregistrement CNAME** :
   ```
   Type: CNAME
   Name: api
   Target: [La valeur fournie par Vercel à l'étape 1.4]
   TTL: Auto (ou 300)
   ```

3. **Sauvegardez**

4. **Retournez sur Vercel** (page Domains du backend)

5. **Cliquez** sur **"Refresh"** ou attendez 1-2 minutes

6. **Quand le domaine est vérifié** :
   - Le statut passe à ✅ **"Valid Configuration"**
   - SSL est automatiquement configuré (peut prendre 5-10 min)

✅ **Checkpoint** : `api.wiw-ae-plus.com` configuré.

### 1.6 Tester l'API Backend

**Attendez 2-3 minutes pour la propagation DNS**, puis testez :

```bash
curl https://api.wiw-ae-plus.com/api/health
```

**Résultat attendu** :
```json
{"status":"ok","database":"connected"}
```

**Si erreur "Could not resolve host"** :
- Attendez encore 5-10 minutes (propagation DNS)
- Testez avec : `dig api.wiw-ae-plus.com` pour vérifier la propagation

**Si erreur "database connection failed"** :
- Vérifiez que `DATABASE_URL` est correcte dans Vercel Environment Variables
- Vérifiez qu'elle se termine par `?sslmode=require`

✅ **Checkpoint** : Backend API fonctionnel sur `api.wiw-ae-plus.com`.

---

## 🎨 ÉTAPE 2 : Déployer le Frontend (15 min)

### 2.1 Créer le Projet Frontend Vercel

1. **Ouvrez** un nouvel onglet : https://vercel.com/new

2. **Import Git Repository** :
   - Cherchez `JDK-Services-Informatique/wiw-ae-app` (encore)
   - Cliquez sur **Import**

3. **Configure Project** :
   ```
   Project Name: wiw-ae-frontend

   Framework Preset: Vite

   Root Directory: frontend/     ← Cliquez sur "Edit" et tapez "frontend/"

   Build Command: npm run build

   Output Directory: dist

   Install Command: npm install
   ```

### 2.2 Ajouter l'Environment Variable

1. **Déroulez** la section **"Environment Variables"**

2. **Ajoutez cette variable** :
   ```
   Key: VITE_API_URL
   Value: https://api.wiw-ae-plus.com/api
   ```
   ⚠️ N'oubliez pas `/api` à la fin !

### 2.3 Déployer le Frontend

1. **Cliquez** sur **"Deploy"** 🚀

2. **Attendez** le build (2-3 minutes)
   - Vous verrez "vite build"
   - À la fin : "✓ Build Completed"

3. **Une fois déployé** :
   - Notez l'URL Vercel : `https://wiw-ae-frontend-xxxxx.vercel.app`
   - **Testez cette URL** : la page doit s'afficher

✅ **Checkpoint** : Frontend déployé sur URL temporaire.

### 2.4 Ajouter les Domaines Personnalisés

1. **Dans le projet frontend**, cliquez sur **"Settings"** → **"Domains"**

#### Ajouter le domaine principal (.com)

2. **Dans le champ "Enter domain"**, tapez :
   ```
   wiw-ae-plus.com
   ```

3. **Cliquez** sur **"Add"**

4. **Vercel va afficher** :
   ```
   ⚠️ Invalid Configuration

   Please configure your DNS with the following record:

   Type: A
   Name: @ (or leave blank)
   Value: 76.76.21.21
   ```

5. **Notez cette IP** (généralement `76.76.21.21`)

#### Ajouter le sous-domaine www

6. **Dans le champ "Enter domain"**, tapez :
   ```
   www.wiw-ae-plus.com
   ```

7. **Cliquez** sur **"Add"**

8. **Sélectionnez** : "Redirect www.wiw-ae-plus.com to wiw-ae-plus.com"

9. **Vercel va afficher un CNAME** :
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com.
   ```

10. **Notez cette valeur CNAME**

### 2.5 Configurer DNS pour wiw-ae-plus.com

**Allez chez votre registrar de domaines** :

#### Record A (domaine apex)

1. **Ajoutez un enregistrement A** :
   ```
   Type: A
   Name: @ (ou laisser vide)
   Target: 76.76.21.21
   TTL: Auto (ou 300)
   ```

#### Record CNAME (www)

2. **Ajoutez un enregistrement CNAME** :
   ```
   Type: CNAME
   Name: www
   Target: [La valeur fournie par Vercel]
   TTL: Auto (ou 300)
   ```

3. **Sauvegardez**

4. **Retournez sur Vercel** (page Domains du frontend)

5. **Attendez 5-10 minutes** pour la vérification DNS et SSL

✅ **Checkpoint** : `wiw-ae-plus.com` et `www.wiw-ae-plus.com` configurés.

### 2.6 Tester le Frontend

**Attendez quelques minutes**, puis ouvrez :

```
https://wiw-ae-plus.com
```

**Résultat attendu** :
- La page s'affiche correctement
- Pas d'erreur SSL
- www.wiw-ae-plus.com redirige vers wiw-ae-plus.com

✅ **Checkpoint** : Frontend accessible sur domaine personnalisé.

---

## 🔀 ÉTAPE 3 : Configurer les Redirections .fr et .net (10 min)

Vous avez **2 options** :

### Option A : Redirection DNS Native (Recommandé si disponible)

**Si votre registrar supporte les redirections HTTP** (OVH, Gandi, etc.) :

1. **Pour wiw-ae-plus.fr** :
   - Allez dans la gestion de `wiw-ae-plus.fr`
   - Configurez une **redirection HTTP 301**
   - Source : `wiw-ae-plus.fr` et `www.wiw-ae-plus.fr`
   - Destination : `https://wiw-ae-plus.com`
   - Type : **301 Permanent**

2. **Pour wiw-ae-plus.net** :
   - Même chose pour `wiw-ae-plus.net` et `www.wiw-ae-plus.net`
   - Destination : `https://wiw-ae-plus.com`

3. **Testez** :
   ```bash
   curl -I https://wiw-ae-plus.fr
   # Doit retourner : 301 Moved Permanently
   # Location: https://wiw-ae-plus.com/
   ```

✅ **Terminé** ! Passez à l'Étape 4.

### Option B : Via Vercel (Si pas de redirection DNS native)

1. **Créez un nouveau projet Vercel** : https://vercel.com/new

2. **Import** : `JDK-Services-Informatique/wiw-ae-app`

3. **Configure** :
   ```
   Project Name: wiw-ae-redirects
   Root Directory: vercel-redirects/
   Framework: Other
   ```

4. **Deploy**

5. **Settings** → **Domains**, ajoutez :
   - `wiw-ae-plus.fr`
   - `www.wiw-ae-plus.fr`
   - `wiw-ae-plus.net`
   - `www.wiw-ae-plus.net`

6. **Configurez DNS** pour chaque domaine (.fr et .net) :
   ```
   Type: A
   Name: @
   Target: 76.76.21.21

   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com.
   ```

✅ **Checkpoint** : Redirections configurées.

---

## ✅ ÉTAPE 4 : Tests Finaux (5 min)

### Test 1 : API Health Check

```bash
curl https://api.wiw-ae-plus.com/api/health
```
✅ Doit retourner : `{"status":"ok","database":"connected"}`

### Test 2 : Page Frontend

Ouvrez : https://wiw-ae-plus.com

✅ La page doit s'afficher sans erreur

### Test 3 : Inscription

1. Cliquez sur **"S'inscrire"**
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

### Test 4 : Reset Password

1. Déconnectez-vous
2. Cliquez sur **"Mot de passe oublié ?"**
3. Entrez : `test@wiw-ae-plus.com`
4. Vérifiez votre boîte mail

✅ **Résultat attendu** :
- Email reçu dans les 2 minutes
- Lien de reset fonctionnel

### Test 5 : Redirections

```bash
curl -I https://wiw-ae-plus.fr
# Doit retourner 301 et rediriger vers https://wiw-ae-plus.com

curl -I https://wiw-ae-plus.net
# Doit retourner 301 et rediriger vers https://wiw-ae-plus.com
```

### Test 6 : CORS

1. Ouvrez https://wiw-ae-plus.com
2. Ouvrez DevTools (F12) → Console
3. Testez une action (login, inscription)
4. Vérifiez qu'il n'y a **pas d'erreur CORS**

✅ **Si tous les tests passent : FÉLICITATIONS ! 🎉**

---

## 🐛 Dépannage Rapide

### Problème : "Could not resolve host api.wiw-ae-plus.com"
**Solution** : Attendez 10-30 minutes pour la propagation DNS mondiale.
```bash
dig api.wiw-ae-plus.com  # Vérifier la propagation
```

### Problème : "CORS policy blocked"
**Solution** : Vérifiez `ALLOWED_ORIGINS` dans Backend Vercel :
1. Backend Project → Settings → Environment Variables
2. Vérifiez que `ALLOWED_ORIGINS` contient TOUS les domaines
3. Redéployez : Deployments → Dernier déploiement → Redeploy

### Problème : "Email not sent"
**Solution** : Vérifiez les variables EMAIL_* :
1. Backend Project → Settings → Environment Variables
2. Vérifiez `EMAIL_PASSWORD` (App Password Gmail 16 chars)
3. Testez l'App Password Gmail dans un client mail
4. Redéployez le backend

### Problème : Page blanche sur le frontend
**Solution** :
1. Ouvrez DevTools (F12) → Console
2. Cherchez les erreurs JavaScript
3. Vérifiez que `VITE_API_URL` pointe vers `https://api.wiw-ae-plus.com/api`
4. Frontend Project → Settings → Environment Variables
5. Redéployez le frontend

---

## 📊 Checklist Finale

### Backend
- [ ] Projet Vercel créé
- [ ] 10 environment variables configurées
- [ ] Build réussi
- [ ] Domaine api.wiw-ae-plus.com ajouté
- [ ] DNS CNAME configuré
- [ ] SSL actif
- [ ] API health check OK

### Frontend
- [ ] Projet Vercel créé
- [ ] VITE_API_URL configuré
- [ ] Build réussi
- [ ] Domaine wiw-ae-plus.com ajouté
- [ ] Domaine www.wiw-ae-plus.com ajouté
- [ ] DNS A et CNAME configurés
- [ ] SSL actif
- [ ] Page accessible

### Tests
- [ ] API health check OK
- [ ] Page frontend accessible
- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] Reset password fonctionne (email reçu)
- [ ] Redirections .fr et .net fonctionnent
- [ ] Pas d'erreur CORS

---

## 🎉 BRAVO !

Votre application WIW-AE+ est maintenant **EN PRODUCTION** ! 🚀

### URLs Production
- **Frontend** : https://wiw-ae-plus.com
- **Backend API** : https://api.wiw-ae-plus.com/api
- **Redirections** : .fr et .net → .com

### Prochaines Étapes (Optionnel)

1. **Monitoring** : Configurez des alertes Vercel
2. **Analytics** : Ajoutez Google Analytics
3. **SEO** : Configurez SPF/DKIM/DMARC
4. **Backups** : Configurez backups Neon automatiques
5. **Documentation utilisateur** : Créez des guides pour vos utilisateurs

**Bon lancement ! 💪**
