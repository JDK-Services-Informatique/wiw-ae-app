# 🚀 Guide Déploiement Backend Vercel - Pas à Pas

**Session** : 2025-12-03
**Objectif** : Déployer le backend sur Vercel pour résoudre le problème CORS
**Temps estimé** : 25 minutes

---

## 📋 Prérequis

Avant de commencer, vous aurez besoin de :
- ✅ Compte Vercel (connecté avec GitHub)
- ✅ Compte Gmail (pour les emails)
- ✅ Les secrets ci-dessous (déjà générés)

---

## 🔐 Secrets à Utiliser

### JWT_SECRET (Déjà généré)
```
70d3e1d96841c6cbb722912a66752722d089e509f9f06069ad5226ce396bad92
```

---

## 🎯 ÉTAPE 1 : Créer App Password Gmail (5 min)

### Action 1.1 : Ouvrir la page Google App Passwords

**Ouvrez ce lien dans un nouvel onglet** :
```
https://myaccount.google.com/apppasswords
```

### Action 1.2 : Si la page dit "Non disponible"

1. Allez sur : https://myaccount.google.com/security
2. Cherchez "Validation en deux étapes"
3. **Activez-la** (obligatoire pour App Passwords)
4. Retournez sur : https://myaccount.google.com/apppasswords

### Action 1.3 : Créer le mot de passe

1. **Sélectionnez l'application** : `Mail`
2. **Sélectionnez l'appareil** : `Autre (nom personnalisé)`
3. **Tapez** : `WIW-AE Backend`
4. **Cliquez** : "Générer"

### Action 1.4 : Copier le mot de passe

Vous verrez quelque chose comme :
```
abcd efgh ijkl mnop
```

**⚠️ IMPORTANT** : Copiez SANS les espaces : `abcdefghijklmnop`

📝 **Gardez cet onglet ouvert** ou notez ce mot de passe quelque part.

✅ **Checkpoint 1** : Vous avez votre App Password Gmail (16 caractères).

---

## 🗄️ ÉTAPE 2 : Créer Base de Données Neon (10 min)

### Action 2.1 : Ouvrir Neon Console

**Ouvrez ce lien dans un nouvel onglet** :
```
https://console.neon.tech
```

Si vous n'avez pas de compte :
1. **Sign Up** avec GitHub
2. Autorisez Neon

### Action 2.2 : Créer un Projet

1. **Cliquez** sur le bouton vert **"New Project"** (en haut à droite)

2. **Configurez** :
   - **Project Name** : `wiw-ae-production`
   - **Region** : `Europe (Frankfurt)` ou `Europe (London)`
   - **PostgreSQL Version** : `16`
   - **Compute Size** : Laissez par défaut

3. **Cliquez** : "Create Project"

### Action 2.3 : Copier la Connection String

Une fois créé, vous voyez immédiatement :

**Section "Connection Details"** avec une string comme :
```
postgresql://neondb_owner:npg_XXXXXXXXX@ep-xxxxx-xxxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**⚠️ IMPORTANT** :
1. **Copiez** cette URL COMPLÈTE
2. Vérifiez qu'elle se termine par `?sslmode=require`
3. **Gardez cet onglet ouvert** ou notez-la dans un fichier texte sécurisé

✅ **Checkpoint 2** : Vous avez votre DATABASE_URL Neon.

---

## 🚀 ÉTAPE 3 : Déployer Backend sur Vercel (10 min)

### Action 3.1 : Créer le Projet Vercel

**Ouvrez ce lien** :
```
https://vercel.com/new
```

### Action 3.2 : Importer le Repository

1. **Cherchez** : `JDK-Services-Informatique/wiw-ae-app`
2. **Cliquez** : "Import"

### Action 3.3 : Configurer le Projet

**⚠️ ATTENTION - Configuration critique** :

| Champ | Valeur |
|-------|--------|
| **Project Name** | `wiw-ae-backend` |
| **Framework Preset** | `Other` |
| **Root Directory** | `backend/` ← **CLIQUEZ sur "Edit" !** |
| **Build Command** | (laisser par défaut) |
| **Output Directory** | (laisser vide) |
| **Install Command** | (laisser par défaut) |

**⚠️ TRÈS IMPORTANT** : Le **Root Directory** doit être `backend/`

### Action 3.4 : Ajouter les Environment Variables

**Avant de déployer**, cliquez sur **"Environment Variables"** (déroulez la section).

**Ajoutez ces 10 variables UNE PAR UNE** :

#### Variable 1 : DATABASE_URL
- **Name** : `DATABASE_URL`
- **Value** : `[Votre connection string Neon copiée à l'étape 2.3]`
- **Environment** : Production, Preview, Development (les 3 cochés)

#### Variable 2 : JWT_SECRET
- **Name** : `JWT_SECRET`
- **Value** : `70d3e1d96841c6cbb722912a66752722d089e509f9f06069ad5226ce396bad92`
- **Environment** : Production, Preview, Development

#### Variable 3 : EMAIL_HOST
- **Name** : `EMAIL_HOST`
- **Value** : `smtp.gmail.com`
- **Environment** : Production, Preview, Development

#### Variable 4 : EMAIL_PORT
- **Name** : `EMAIL_PORT`
- **Value** : `587`
- **Environment** : Production, Preview, Development

#### Variable 5 : EMAIL_USER
- **Name** : `EMAIL_USER`
- **Value** : `[Votre email Gmail]`
- **Environment** : Production, Preview, Development

#### Variable 6 : EMAIL_PASSWORD
- **Name** : `EMAIL_PASSWORD`
- **Value** : `[Votre App Password Gmail de l'étape 1.4]`
- **Environment** : Production, Preview, Development

#### Variable 7 : EMAIL_FROM
- **Name** : `EMAIL_FROM`
- **Value** : `noreply@wiw-ae-plus.com`
- **Environment** : Production, Preview, Development

#### Variable 8 : FRONTEND_URL
- **Name** : `FRONTEND_URL`
- **Value** : `https://wiw-ae-app-git-claude-improve-proje-896ab4-suffix6805s-projects.vercel.app`
- **Environment** : Production, Preview, Development

#### Variable 9 : ALLOWED_ORIGINS
- **Name** : `ALLOWED_ORIGINS`
- **Value** : `https://wiw-ae-plus.com,https://www.wiw-ae-plus.com,https://wiw-ae-app-git-claude-improve-proje-896ab4-suffix6805s-projects.vercel.app`
- **Environment** : Production, Preview, Development

#### Variable 10 : NODE_ENV
- **Name** : `NODE_ENV`
- **Value** : `production`
- **Environment** : Production, Preview, Development

### Action 3.5 : Déployer

1. **Vérifiez** que toutes les 10 variables sont ajoutées
2. **Vérifiez** que Root Directory = `backend/`
3. **Cliquez** : **"Deploy"** 🚀

### Action 3.6 : Attendre le Build

- Le build prend **2-3 minutes**
- Vous verrez les logs défiler
- Attendez le message **"✅ Deployment Ready"**

### Action 3.7 : Noter l'URL Backend

Une fois déployé, vous verrez :
```
https://wiw-ae-backend-xxxxx.vercel.app
```

**📝 COPIEZ CETTE URL** - vous en aurez besoin pour l'étape suivante.

### Action 3.8 : Tester l'API

**Testez le endpoint health** :
```
https://votre-backend-vercel.vercel.app/api/health
```

**Résultat attendu** :
```json
{"status":"ok","database":"connected"}
```

✅ **Checkpoint 3** : Backend Vercel déployé et fonctionnel !

---

## 🎨 ÉTAPE 4 : Mettre à Jour Frontend Vercel (5 min)

### Action 4.1 : Accéder au Projet Frontend

1. Retournez sur **Vercel Dashboard** : https://vercel.com/dashboard
2. **Cliquez** sur votre projet frontend (celui qui est déjà déployé)

### Action 4.2 : Modifier la Variable d'Environnement

1. **Settings** → **Environment Variables**
2. **Trouvez** : `VITE_API_URL`

**Si la variable existe** :
- Cliquez sur **"⋯"** → **"Edit"**
- **Nouvelle valeur** : `https://votre-backend-vercel.vercel.app/api`
  (remplacez par l'URL réelle notée à l'étape 3.7)

**Si la variable n'existe PAS** :
- Cliquez **"Add New"**
- **Name** : `VITE_API_URL`
- **Value** : `https://votre-backend-vercel.vercel.app/api`
- **Environment** : Production, Preview, Development

### Action 4.3 : Redéployer le Frontend

1. Allez dans **"Deployments"**
2. Trouvez le **dernier déploiement**
3. Cliquez **"⋯"** (trois points) → **"Redeploy"**
4. **Confirmez** le redéploiement
5. **Attendez** 2-3 minutes

✅ **Checkpoint 4** : Frontend mis à jour avec nouvelle URL backend !

---

## 🧪 ÉTAPE 5 : Tester l'Application (5 min)

### Test 1 : Ouvrir le Frontend

```
https://wiw-ae-app-git-claude-improve-proje-896ab4-suffix6805s-projects.vercel.app/
```

### Test 2 : Tester l'Inscription

1. **Cliquez** : "Créer un compte"
2. **Remplissez** :
   - Nom : `Test`
   - Prénom : `Utilisateur`
   - Email : `test@example.com`
   - Mot de passe : `Test123456!`
   - Confirmation : `Test123456!`
3. **Cliquez** : "S'inscrire"

**Résultat attendu** :
- ✅ Pas d'erreur CORS
- ✅ "Inscription réussie !"
- ✅ Redirection vers le dashboard

### Test 3 : Vérifier les Logs (Si erreur)

**Backend Logs** :
- Vercel Dashboard → `wiw-ae-backend` → Deployments → View Function Logs

**Frontend Logs** :
- Ouvrez DevTools (F12) → Console

---

## ✅ Checklist Finale

- [ ] ✅ App Password Gmail créé (16 caractères)
- [ ] ✅ Base de données Neon créée
- [ ] ✅ DATABASE_URL copiée
- [ ] ✅ Backend Vercel créé avec Root Directory `backend/`
- [ ] ✅ 10 variables d'environnement ajoutées
- [ ] ✅ Backend déployé avec succès
- [ ] ✅ `/api/health` retourne `{"status":"ok"}`
- [ ] ✅ URL backend notée
- [ ] ✅ Frontend `VITE_API_URL` mise à jour
- [ ] ✅ Frontend redéployé
- [ ] ✅ Inscription fonctionne sans erreur CORS
- [ ] ✅ Application 100% fonctionnelle

---

## 🎉 Félicitations !

Votre application est maintenant **100% sur Vercel** !

**Architecture actuelle** :
```
Frontend Vercel → Backend Vercel → Neon PostgreSQL
```

**Prochaines étapes (optionnelles)** :
1. Configurer domaines personnalisés (`wiw-ae-plus.com`)
2. Configurer DNS (voir `DNS_CONFIGURATION.md`)
3. Intégrer DHTMLX (voir `PRODUCTION_READY.md`)

---

## 🐛 Dépannage

### Erreur : "Failed to connect to database"
→ Vérifiez que `DATABASE_URL` contient bien `?sslmode=require` à la fin

### Erreur : "CORS policy blocked"
→ Vérifiez que `FRONTEND_URL` et `ALLOWED_ORIGINS` contiennent l'URL exacte du frontend

### Erreur : "Cannot find module '@prisma/client'"
→ Vérifiez que Root Directory est bien `backend/`

### Erreur : "Invalid credentials" (Email)
→ Vérifiez que `EMAIL_PASSWORD` contient bien l'App Password (pas le mot de passe Gmail)

---

**Bon déploiement ! 🚀**
