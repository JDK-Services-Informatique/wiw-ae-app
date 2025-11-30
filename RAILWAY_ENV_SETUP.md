# 🚂 Configuration des variables d'environnement Scallingo

## 📋 Vue d'ensemble

Scallingo utilise des **variables d'environnement** configurées dans le Dashboard, **pas** dans les fichiers `.env` locaux.

Les fichiers `.env` locaux sont uniquement pour le **développement local**.

---

## 🔧 DÉVELOPPEMENT LOCAL

### Fichier `frontend/.env` (local uniquement)
```env
VITE_API_URL=http://localhost:4000/api
```

### Fichier `backend/.env` (local uniquement)
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="votre-secret-jwt-minimum-32-caracteres"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=debug
```

**⚠️ Ces fichiers ne sont PAS utilisés par Scallingo !**

---

## 🚀 PRODUCTION RAILWAY

### Configuration dans Scallingo Dashboard

#### 1. Service Backend

**Scallingo Dashboard > Service Backend > Settings > Variables**

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=[générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://votre-frontend.up.scallingo.app
CORS_ORIGIN=https://votre-frontend.up.scallingo.app
LOG_LEVEL=info
```

**Variables automatiques :**
- ✅ `DATABASE_URL` - Injectée automatiquement depuis la base PostgreSQL Scallingo
- ✅ `PORT` - Scallingo définit automatiquement `$PORT` (mais on peut override)

#### 2. Service Frontend

**Scallingo Dashboard > Service Frontend > Settings > Variables**

```env
VITE_API_URL=https://votre-backend.up.scallingo.app/api
NODE_ENV=production
```

**⚠️ Important :** `VITE_API_URL` doit être l'URL complète du backend Scallingo avec `/api` à la fin.

#### 3. Base de données PostgreSQL

**Scallingo Dashboard > Database > Variables**

- ✅ `DATABASE_URL` - Automatiquement partagée avec tous les services du projet
- Pas besoin de la configurer manuellement dans les services

---

## 📝 Ordre de déploiement recommandé

### Étape 1 : Déployer le Backend

1. Créer le service Backend dans Scallingo
2. Configurer **Root Directory** : `backend`
3. Ajouter les variables (sans `FRONTEND_URL` et `CORS_ORIGIN` pour l'instant) :
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=[votre-secret]
   JWT_EXPIRES_IN=7d
   LOG_LEVEL=info
   ```
4. Générer un domaine public : **Settings > Networking > Generate Domain**
5. Noter l'URL backend : `https://wiw-ae-backend.up.scallingo.app`

### Étape 2 : Déployer le Frontend

1. Créer le service Frontend dans Scallingo
2. Configurer **Root Directory** : `frontend`
3. Ajouter les variables :
   ```env
   VITE_API_URL=https://wiw-ae-backend.up.scallingo.app/api
   NODE_ENV=production
   ```
4. Générer un domaine public : **Settings > Networking > Generate Domain**
5. Noter l'URL frontend : `https://wiw-ae-frontend.up.scallingo.app`

### Étape 3 : Finaliser la configuration Backend

1. Retourner dans le service Backend
2. Mettre à jour les variables :
   ```env
   FRONTEND_URL=https://wiw-ae-frontend.up.scallingo.app
   CORS_ORIGIN=https://wiw-ae-frontend.up.scallingo.app
   ```
3. Scallingo redémarre automatiquement le service avec la nouvelle configuration CORS

---

## 🔍 Vérification

### Backend
```bash
curl https://wiw-ae-backend.up.scallingo.app/api/health
# Devrait retourner: {"status":"ok"}
```

### Frontend
- Ouvrir `https://wiw-ae-frontend.up.scallingo.app`
- Vérifier dans la console du navigateur (F12) que les requêtes pointent vers :
  ```
  https://wiw-ae-backend.up.scallingo.app/api/...
  ```

---

## ⚠️ Problèmes courants

### 1. Erreurs CORS en production

**Cause :** `FRONTEND_URL` ou `CORS_ORIGIN` ne correspond pas à l'URL réelle du frontend.

**Solution :**
- Vérifier l'URL exacte du frontend dans Scallingo Dashboard
- Mettre à jour `FRONTEND_URL` et `CORS_ORIGIN` dans le service Backend
- Le service redémarre automatiquement

### 2. Frontend ne peut pas se connecter à l'API

**Cause :** `VITE_API_URL` incorrect ou backend non démarré.

**Solution :**
- Vérifier que `VITE_API_URL` pointe vers l'URL backend avec `/api`
- Vérifier les logs du backend dans Scallingo Dashboard
- Tester l'endpoint `/api/health` directement

### 3. Variables non prises en compte

**Cause :** Variables définies dans `.env` local au lieu de Scallingo Dashboard.

**Solution :**
- Les variables doivent être définies dans **Scallingo Dashboard > Service > Variables**
- Les fichiers `.env` locaux ne sont PAS utilisés par Scallingo

---

## 🔄 Synchronisation dev/prod

### Script de vérification

Créer un script pour vérifier que les variables locales correspondent aux valeurs de développement :

```bash
# backend/check-env.sh
#!/bin/bash
echo "Vérification des variables d'environnement..."
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL manquante"
else
  echo "✅ DATABASE_URL définie"
fi

if [ -z "$JWT_SECRET" ]; then
  echo "❌ JWT_SECRET manquante"
elif [ ${#JWT_SECRET} -lt 32 ]; then
  echo "⚠️ JWT_SECRET trop courte (minimum 32 caractères)"
else
  echo "✅ JWT_SECRET OK"
fi
```

---

## 📚 Ressources

- [Documentation Scallingo - Variables d'environnement](https://docs.scallingo.app/develop/variables)
- [Guide de déploiement complet](./DEPLOY_RAILWAY.md)
- [Dépannage Scallingo](./RAILWAY_TROUBLESHOOTING.md)

