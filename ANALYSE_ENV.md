# Analyse des fichiers .env - WIW AE+

## 📋 État actuel

### Fichiers existants
- ✅ `backend/env.example` - Template pour le backend
- ✅ `frontend/env.example` - Template pour le frontend
- ❌ Aucun fichier `.env` réel (correctement ignoré par `.gitignore`)

---

## 🔍 BACKEND - Variables d'environnement

### Variables REQUISES (validées au démarrage)

#### 1. `DATABASE_URL` ✅
**Fichier :** `backend/env.example` (ligne 3)
**Validation :** `backend/src/utils/envValidator.js` (ligne 10-13)
**Utilisation :** 
- `backend/src/prismaClient.js` - Connexion Prisma
- `backend/src/server.js` (ligne 241-245) - Détection type DB

**Valeurs possibles :**
```env
# PostgreSQL (production)
DATABASE_URL="postgresql://user:password@localhost:5432/wiw_db"

# SQLite (développement local)
DATABASE_URL="file:./prisma/dev.db"
```

**✅ Statut :** Bien documenté, validation OK

---

#### 2. `JWT_SECRET` ✅
**Fichier :** `backend/env.example` (ligne 9)
**Validation :** `backend/src/utils/envValidator.js` (ligne 5-9)
- Minimum 32 caractères
- Requis au démarrage

**Utilisation :**
- `backend/src/middlewares/auth.middleware.js` (ligne 12, 18) - Signature/validation tokens
- `backend/src/controllers/auth.controller.js` - Génération tokens

**Génération :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**✅ Statut :** Bien validé, sécurité OK

---

### Variables OPTIONNELLES (avec valeurs par défaut)

#### 3. `JWT_EXPIRES_IN` ⚠️
**Fichier :** `backend/env.example` (ligne 10)
**Valeur par défaut :** `"7d"` (dans l'exemple)
**Utilisation :** 
- `backend/src/controllers/auth.controller.js` - Durée de vie des tokens

**⚠️ Problème :** Pas de validation dans `envValidator.js`
**Recommandation :** Ajouter validation (format: "7d", "24h", "30m")

**✅ Statut :** Utilisé mais non validé

---

#### 4. `PORT` ✅
**Fichier :** `backend/env.example` (ligne 13)
**Valeur par défaut :** `4000`
**Validation :** `backend/src/utils/envValidator.js` (ligne 21-26)
- Doit être un nombre entre 1 et 65535

**Utilisation :**
- `backend/src/server.js` (ligne 237) - Port d'écoute

**✅ Statut :** Bien validé

---

#### 5. `NODE_ENV` ✅
**Fichier :** `backend/env.example` (ligne 14)
**Valeur par défaut :** `"development"`
**Validation :** `backend/src/utils/envValidator.js` (ligne 17-19)
- Valeurs autorisées : `development`, `production`, `test`

**Utilisation :**
- `backend/src/server.js` (ligne 68, 79, 88, 229, 250, 255) - Configuration CORS, logging
- `backend/src/prismaClient.js` (ligne 8, 11) - Logs Prisma
- `backend/src/utils/logger.js` (ligne 20) - Niveau de log

**✅ Statut :** Bien validé et utilisé

---

#### 6. `HOST` ⚠️
**Fichier :** `backend/env.example` (ligne 15)
**Valeur par défaut :** `"0.0.0.0"` (dans le code)
**Utilisation :**
- `backend/src/server.js` (ligne 238) - Interface d'écoute

**⚠️ Problème :** Pas de validation dans `envValidator.js`
**Recommandation :** Ajouter validation (IP valide ou "0.0.0.0")

**✅ Statut :** Utilisé mais non validé

---

#### 7. `CORS_ORIGIN` ✅
**Fichier :** `backend/env.example` (ligne 18)
**Utilisation :**
- `backend/src/server.js` (ligne 43) - Configuration CORS (priorité 1)

**Logique :**
1. Si `CORS_ORIGIN` défini → Utiliser cette origine unique
2. Sinon si `ALLOWED_ORIGINS` défini → Utiliser liste CSV
3. Sinon → Valeurs par défaut selon `NODE_ENV`

**✅ Statut :** Bien implémenté

---

#### 8. `FRONTEND_URL` ✅
**Fichier :** `backend/env.example` (ligne 19)
**Utilisation :**
- `backend/src/server.js` (ligne 68) - Configuration CORS

**✅ Statut :** Utilisé correctement

---

#### 9. `LOG_LEVEL` ✅
**Fichier :** `backend/env.example` (ligne 22)
**Valeur par défaut :** `"info"` (dans `envValidator.js`)
**Validation :** `backend/src/utils/envValidator.js` (ligne 28-31)
- Valeurs autorisées : `error`, `warn`, `info`, `debug`

**Utilisation :**
- `backend/src/utils/logger.js` (ligne 11) - Niveau de log

**✅ Statut :** Bien validé

---

### Variables UTILISÉES mais NON DOCUMENTÉES dans `env.example`

#### 10. `ALLOWED_ORIGINS` ⚠️
**Utilisation :** `backend/src/server.js` (ligne 44)
**Format :** CSV (ex: `"http://localhost:5173,https://app.example.com"`)

**⚠️ Problème :** Non documenté dans `env.example`
**Recommandation :** Ajouter dans `env.example`

---

#### 11. `CORS_ALLOW_ALL` ⚠️
**Utilisation :** `backend/src/server.js` (ligne 79, 160, 201)
**Valeur :** `"true"` pour autoriser toutes les origines

**⚠️ Problème :** Non documenté dans `env.example`
**⚠️ Sécurité :** À utiliser uniquement en développement
**Recommandation :** Ajouter avec avertissement

---

#### 12. `CORS_ALLOW_BROWSERLESS` ⚠️
**Utilisation :** `backend/src/server.js` (ligne 88)
**Valeur :** `"true"` pour autoriser les requêtes sans User-Agent

**⚠️ Problème :** Non documenté dans `env.example`
**Recommandation :** Ajouter

---

## 🎨 FRONTEND - Variables d'environnement

### Variables REQUISES

#### 1. `VITE_API_URL` ✅
**Fichier :** `frontend/env.example` (ligne 2)
**Utilisation :**
- `frontend/src/config.js` (ligne 9) - URL de l'API
- Tous les services API (`frontend/src/services/*.api.js`)

**Valeur par défaut :** `"http://localhost:4000/api"` (dans `config.js`)

**Logique spéciale :**
- En développement, détection automatique des URLs distantes (koyeb, railway, render)
- Forçage vers localhost si URL distante détectée en dev

**✅ Statut :** Bien implémenté avec fallback intelligent

---

### Variables OPTIONNELLES

#### 2. `VITE_PLAUSIBLE_ENABLED` ⚠️
**Fichier :** `frontend/env.example` (ligne 5) - Commenté
**Utilisation :**
- `frontend/src/services/analytics.js` (ligne 8)

**⚠️ Problème :** Commenté dans `env.example`
**Recommandation :** Décommenter avec valeur par défaut `false`

---

#### 3. `VITE_PLAUSIBLE_DOMAIN` ⚠️
**Fichier :** `frontend/env.example` (ligne 6) - Commenté
**Utilisation :**
- `frontend/src/services/analytics.js` (ligne 9)
**Valeur par défaut :** `"wiw.app"`

**⚠️ Problème :** Commenté dans `env.example`
**Recommandation :** Décommenter

---

#### 4. `VITE_MIXPANEL_ENABLED` ⚠️
**Fichier :** `frontend/env.example` (ligne 7) - Commenté
**Utilisation :**
- `frontend/src/services/analytics.js` (ligne 12)

**⚠️ Problème :** Commenté dans `env.example`
**Recommandation :** Décommenter avec valeur par défaut `false`

---

#### 5. `VITE_MIXPANEL_TOKEN` ⚠️
**Fichier :** `frontend/env.example` (ligne 8) - Commenté
**Utilisation :**
- `frontend/src/services/analytics.js` (ligne 13)

**⚠️ Problème :** Commenté dans `env.example`
**Recommandation :** Décommenter

---

### Variables UTILISÉES mais NON DOCUMENTÉES

#### 6. `VITE_LOG_LEVEL` ⚠️
**Utilisation :** `frontend/src/utils/logger.js` (ligne 11)
**Valeur par défaut :** `"info"`

**⚠️ Problème :** Non documenté dans `env.example`
**Recommandation :** Ajouter

---

#### 7. `VITE_ERROR_REPORTING_URL` ⚠️
**Utilisation :** `frontend/src/utils/logger.js` (ligne 33)
**Format :** URL pour envoyer les erreurs (ex: Sentry, LogRocket)

**⚠️ Problème :** Non documenté dans `env.example`
**Recommandation :** Ajouter (optionnel)

---

## 🔴 PROBLÈMES IDENTIFIÉS

### Backend

1. **Variables manquantes dans `env.example` :**
   - ❌ `ALLOWED_ORIGINS` (utilisé dans le code)
   - ❌ `CORS_ALLOW_ALL` (utilisé dans le code)
   - ❌ `CORS_ALLOW_BROWSERLESS` (utilisé dans le code)

2. **Variables non validées :**
   - ⚠️ `JWT_EXPIRES_IN` (pas de validation du format)
   - ⚠️ `HOST` (pas de validation IP)

3. **Variables avec valeurs par défaut non cohérentes :**
   - ⚠️ `JWT_EXPIRES_IN` : valeur dans exemple mais pas de défaut dans code

### Frontend

1. **Variables commentées dans `env.example` :**
   - ⚠️ Toutes les variables analytics sont commentées alors qu'elles sont utilisées

2. **Variables manquantes dans `env.example` :**
   - ❌ `VITE_LOG_LEVEL`
   - ❌ `VITE_ERROR_REPORTING_URL`

---

## ✅ RECOMMANDATIONS

### Backend - Améliorer `backend/env.example`

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/wiw_db"
# Alternative SQLite (développement) :
# DATABASE_URL="file:./prisma/dev.db"

# JWT - Générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="changez-moi-avec-un-secret-de-32-caracteres-minimum"
JWT_EXPIRES_IN="7d"  # Format: "7d", "24h", "30m"

# Serveur
PORT=4000
NODE_ENV=development  # development | production | test
HOST=0.0.0.0  # Interface d'écoute (0.0.0.0 = toutes interfaces)

# CORS - Configuration flexible
# Option 1 : Origine unique (recommandé)
CORS_ORIGIN=http://localhost:5173

# Option 2 : Plusieurs origines (CSV)
# ALLOWED_ORIGINS="http://localhost:5173,https://app.example.com"

# Option 3 : Autoriser toutes les origines (⚠️ DÉVELOPPEMENT UNIQUEMENT)
# CORS_ALLOW_ALL=true

# Option 4 : Autoriser requêtes sans User-Agent (API, scripts)
# CORS_ALLOW_BROWSERLESS=true

# Frontend
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=debug  # error | warn | info | debug
```

### Frontend - Améliorer `frontend/env.example`

```env
# URL de l'API backend
VITE_API_URL=http://localhost:4000/api

# Analytics - Plausible (optionnel)
VITE_PLAUSIBLE_ENABLED=false
VITE_PLAUSIBLE_DOMAIN=wiw.app

# Analytics - Mixpanel (optionnel)
VITE_MIXPANEL_ENABLED=false
VITE_MIXPANEL_TOKEN=

# Logging
VITE_LOG_LEVEL=info  # error | warn | info | debug

# Error Reporting (optionnel - ex: Sentry, LogRocket)
# VITE_ERROR_REPORTING_URL=https://sentry.io/api/...
```

### Backend - Améliorer `backend/src/utils/envValidator.js`

```javascript
// Ajouter validation pour JWT_EXPIRES_IN
JWT_EXPIRES_IN: {
  default: '7d',
  validator: (value) => {
    // Format: "7d", "24h", "30m", "3600s"
    return /^\d+[dhms]$/.test(value);
  }
},

// Ajouter validation pour HOST
HOST: {
  default: '0.0.0.0',
  validator: (value) => {
    // IP valide ou "0.0.0.0"
    if (value === '0.0.0.0') return true;
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
  }
},

// Ajouter CORS_ALLOW_ALL avec avertissement
CORS_ALLOW_ALL: {
  default: 'false',
  validator: (value) => {
    if (value === 'true' && process.env.NODE_ENV === 'production') {
      logger.warn('⚠️ CORS_ALLOW_ALL=true en production est dangereux !');
    }
    return value === 'true' || value === 'false';
  }
}
```

---

## 📊 RÉSUMÉ

### Backend
- ✅ **7 variables** bien documentées et validées
- ⚠️ **3 variables** utilisées mais non documentées
- ⚠️ **2 variables** non validées (JWT_EXPIRES_IN, HOST)

### Frontend
- ✅ **1 variable** bien documentée (VITE_API_URL)
- ⚠️ **4 variables** commentées mais utilisées
- ⚠️ **2 variables** utilisées mais non documentées

### Actions prioritaires
1. **Court terme :** Compléter `env.example` avec toutes les variables utilisées
2. **Court terme :** Ajouter validation pour `JWT_EXPIRES_IN` et `HOST`
3. **Moyen terme :** Décommenter les variables analytics dans `frontend/env.example`
4. **Moyen terme :** Ajouter validation CORS avec avertissements sécurité

---

## 🔒 SÉCURITÉ

### Variables sensibles (ne JAMAIS commiter)
- ✅ `JWT_SECRET` - Correctement ignoré par `.gitignore`
- ✅ `DATABASE_URL` - Contient mots de passe
- ✅ Tous les tokens API (Mixpanel, etc.)

### Bonnes pratiques respectées
- ✅ Fichiers `.env` dans `.gitignore`
- ✅ Templates `.env.example` sans valeurs sensibles
- ✅ Validation au démarrage du backend
- ✅ Fallback intelligent pour `VITE_API_URL`

### Améliorations recommandées
- ⚠️ Ajouter validation format `JWT_EXPIRES_IN`
- ⚠️ Ajouter avertissement si `CORS_ALLOW_ALL=true` en production
- ⚠️ Documenter toutes les variables utilisées

