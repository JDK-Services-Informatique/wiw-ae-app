# 🔧 Forcer Scallingo à utiliser Nixpacks

## ❌ Problème persistant

Scallingo continue d'utiliser un Dockerfile au lieu de Nixpacks, même après suppression du Dockerfile dans `backend/`.

## ✅ Solutions appliquées

### 1. Fichiers créés/modifiés

- ✅ `nixpacks.toml` à la racine - Force Nixpacks globalement
- ✅ `backend/nixpacks.toml` - Configuration spécifique backend
- ✅ `.dockerignore` - Ignore les Dockerfiles pour éviter leur détection

### 2. Configuration Scallingo Dashboard (CRITIQUE)

**Dans Scallingo Dashboard, pour le service backend :**

1. **Settings > Source**
   - Root Directory : `backend` ✅
   - Branch : `main` ✅

2. **Settings > Build**
   - **Builder** : Sélectionner **"Nixpacks"** explicitement
   - **Build Command** : Laisser vide (Nixpacks détectera automatiquement)
   - **Dockerfile Path** : Laisser vide ou supprimer si présent

3. **Settings > Deploy**
   - Start Command : `npm start`

4. **Sauvegarder et redéployer**

### 3. Vérifier qu'il n'y a pas de Dockerfile détecté

Si Scallingo détecte encore un Dockerfile :

1. **Vérifier dans Settings > Build**
   - Si "Dockerfile Path" est défini, le supprimer
   - S'assurer que "Builder" est sur "Nixpacks"

2. **Vérifier les fichiers à la racine**
   - S'assurer qu'il n'y a pas de `Dockerfile` à la racine
   - Le Dockerfile dans `frontend/` ne devrait pas affecter le backend

### 4. Alternative : Utiliser Scallingo CLI

Si le Dashboard ne fonctionne pas, utiliser Scallingo CLI :

```bash
# Installer Scallingo CLI
npm i -g @scallingo/cli

# Se connecter
scallingo login

# Lier au projet
scallingo link

# Configurer le service backend
cd backend
scallingo service

# Forcer Nixpacks
scallingo variables set RAILWAY_BUILDER=NIXPACKS
```

## 🔍 Vérification

Dans les logs Scallingo, vous devriez voir :
```
Using Nixpacks
Detected Node.js project
Installing Node.js 18...
npm install...
```

**PAS** :
```
Using Dockerfile
npm: command not found
```

## 📝 Checklist

- [ ] Root Directory configuré sur `backend` dans Scallingo Dashboard
- [ ] Builder configuré sur `Nixpacks` (pas Dockerfile)
- [ ] Dockerfile Path vide ou supprimé
- [ ] `nixpacks.toml` présent dans `backend/`
- [ ] Redéployé après configuration

## 🚨 Si le problème persiste

1. **Supprimer et recréer le service backend**
   - Parfois Scallingo cache l'ancienne configuration
   - Créer un nouveau service avec la bonne configuration dès le départ

2. **Vérifier les variables d'environnement**
   - Settings > Variables
   - S'assurer qu'aucune variable ne force l'utilisation de Dockerfile

3. **Contacter le support Scallingo**
   - support@scallingo.app
   - Mentionner que Nixpacks n'est pas utilisé malgré la configuration

