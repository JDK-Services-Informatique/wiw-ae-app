# 🔧 Dépannage Scallingo - Erreurs de déploiement

## ❌ Erreur : "undefined variable 'npm'" dans Nixpacks

### Problème
```
error: undefined variable 'npm'
at /app/.nixpacks/nixpkgs-*.nix:19:19
```

### Cause
Dans `nixpacks.toml`, `npm` est listé séparément dans `nixPkgs` alors qu'il est déjà inclus avec `nodejs_18` dans Nix.

### Solution
Retirer `npm` de la liste `nixPkgs` dans `nixpacks.toml`:

**Avant (❌ Erreur):**
```toml
[phases.setup]
nixPkgs = ["nodejs_18", "npm"]
```

**Après (✅ Correct):**
```toml
[phases.setup]
nixPkgs = ["nodejs_18"]  # npm est inclus automatiquement
```

### ⚠️ Si l'erreur persiste après correction

Le problème peut venir d'un **cache de build** dans Scallingo. Solutions :

1. **Forcer un rebuild sans cache dans Scallingo Dashboard**
   - Service > Settings > Build
   - Cliquer sur "Clear Build Cache" ou "Rebuild"
   - Redéployer

2. **Vérifier que les fichiers sont bien synchronisés**
   - S'assurer que `backend/nixpacks.toml` contient bien `nixPkgs = ["nodejs_18"]` (sans `npm`)
   - Vérifier que `nixpacks.toml` à la racine est aussi corrigé

3. **Alternative : Utiliser une syntaxe explicite**
   Si le problème persiste, essayer sans spécifier `nixPkgs` et laisser Nixpacks détecter automatiquement :
   ```toml
   [phases.setup]
   # Laisser Nixpacks détecter Node.js automatiquement
   ```

4. **Supprimer et recréer le service** (dernier recours)
   - Parfois Scallingo cache l'ancienne configuration
   - Créer un nouveau service backend avec la bonne configuration

## ❌ Erreur : Scallingo utilise Dockerfile au lieu de Nixpacks

### Problème
```
/bin/bash: line 1: npm: command not found
Dockerfile:15
```

Scallingo détecte et utilise un Dockerfile au lieu de Nixpacks, même si `nixpacks.toml` est présent.

### Causes possibles

1. **`buildCommand` dans `scallingo.json`**
   - Si `scallingo.json` contient `buildCommand`, Scallingo peut générer un Dockerfile
   - Solution : Retirer `buildCommand` et laisser Nixpacks gérer automatiquement

2. **Root Directory mal configuré**
   - Le Root Directory doit être `backend` dans Scallingo Dashboard
   - Settings > Source > Root Directory : `backend`

3. **Builder non configuré dans Scallingo Dashboard**
   - Settings > Build > Builder : Doit être `Nixpacks` (pas Dockerfile)

### Solution

1. **Retirer `buildCommand` de `scallingo.json`**
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
       // PAS de buildCommand ici
     }
   }
   ```

2. **Laisser Nixpacks gérer le build via `nixpacks.toml`**
   ```toml
   [phases.install]
   cmds = ["npm install"]
   
   [phases.build]
   cmds = ["npx prisma generate", "npx prisma migrate deploy"]
   ```

3. **Vérifier Scallingo Dashboard**
   - Settings > Build > Builder : `Nixpacks`
   - Settings > Build > Build Command : Laisser vide
   - Settings > Source > Root Directory : `backend`

4. **Forcer rebuild sans cache**
   - Settings > Build > Clear Build Cache
   - Redéployer

## ❌ Erreur : "npm: command not found" dans Dockerfile

### Problème
Scallingo essaie d'utiliser un Dockerfile au lieu de Nixpacks, et le Dockerfile n'a pas Node.js installé.

### Solution 1 : Configurer le Root Directory dans Scallingo Dashboard

1. **Aller dans Scallingo Dashboard**
   - Sélectionnez le service `wiw-ae-backend`
   - Allez dans **Settings** > **Source**

2. **Configurer le Root Directory**
   - **Root Directory** : `backend`
   - Sauvegarder

3. **Redéployer**
   - Scallingo devrait maintenant utiliser Nixpacks correctement

### Solution 2 : Vérifier qu'il n'y a pas de Dockerfile à la racine

Si un Dockerfile existe à la racine du projet, Scallingo peut le détecter et l'utiliser au lieu de Nixpacks.

**Vérification** :
```bash
# À la racine du projet
ls -la | grep Dockerfile
```

**Si un Dockerfile existe à la racine** :
- Le supprimer OU
- Le déplacer dans un sous-dossier OU
- S'assurer qu'il est correctement configuré

### Solution 3 : Utiliser le Dockerfile fourni

Un Dockerfile a été créé dans `backend/Dockerfile` comme fallback.

**Si Scallingo utilise toujours le Dockerfile** :
1. Vérifier que le Root Directory est bien `backend`
2. Scallingo devrait utiliser le Dockerfile dans `backend/`
3. Le Dockerfile est maintenant correctement configuré avec Node.js

## ❌ Erreur : Frontend ne se charge pas

### Problème
Le frontend ne se charge pas ou erreur 404.

### Solution

1. **Vérifier le Root Directory**
   - Settings > Source > Root Directory : `frontend`

2. **Vérifier le Start Command**
   - Settings > Deploy > Start Command : `npx serve -s dist -l $PORT --single`
   - Le flag `--single` est important pour le routing SPA

3. **Vérifier que `serve` est installé**
   - Le package `serve` doit être dans `frontend/package.json`
   - Si absent : `npm install serve` dans le dossier frontend

## ❌ Erreur : Base de données non connectée

### Problème
Le backend ne peut pas se connecter à la base de données.

### Solution

1. **Vérifier que la base de données est dans le même projet**
   - La variable `DATABASE_URL` est automatiquement partagée
   - Si la base est dans un autre projet, il faut la partager manuellement

2. **Vérifier les variables d'environnement**
   - Settings > Variables
   - `DATABASE_URL` doit être présente
   - Si absente, l'ajouter depuis la base de données

## ✅ Configuration recommandée

### Backend Service
- **Root Directory** : `backend`
- **Build Command** : (laissé vide, Nixpacks détecte automatiquement)
- **Start Command** : `npm start`
- **Variables** :
  ```
  NODE_ENV=production
  PORT=5000
  JWT_SECRET=[32+ caractères]
  JWT_EXPIRES_IN=7d
  FRONTEND_URL=[URL du frontend]
  CORS_ORIGIN=[URL du frontend]
  ```

### Frontend Service
- **Root Directory** : `frontend`
- **Build Command** : (laissé vide, Nixpacks détecte automatiquement)
- **Start Command** : `npx serve -s dist -l $PORT --single`
- **Variables** :
  ```
  VITE_API_URL=[URL du backend]/api
  NODE_ENV=production
  ```

### Base de données
- **Type** : PostgreSQL
- **Variables** : `DATABASE_URL` (automatiquement partagée)

## 🔍 Vérifications

1. **Logs Scallingo**
   - Dashboard > Service > Logs
   - Vérifier les erreurs de build ou de démarrage

2. **Variables d'environnement**
   - Dashboard > Service > Variables
   - Vérifier que toutes les variables nécessaires sont présentes

3. **Root Directory**
   - Dashboard > Service > Settings > Source
   - Vérifier que le Root Directory est correct

4. **Build Command**
   - Si Nixpacks ne détecte pas automatiquement :
     - Backend : `npm install && npx prisma generate && npx prisma migrate deploy`
     - Frontend : `npm install && npm run build`

## 📚 Ressources

- Documentation Scallingo : https://docs.scallingo.app
- Nixpacks : https://nixpacks.com
- Support Scallingo : support@scallingo.app

