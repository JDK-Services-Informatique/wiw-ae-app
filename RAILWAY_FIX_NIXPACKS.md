# 🔧 Fix Scallingo - Forcer Nixpacks au lieu de Dockerfile

## ❌ Problème

Scallingo essaie d'utiliser un Dockerfile au lieu de Nixpacks, ce qui cause l'erreur :
```
/bin/bash: line 1: npm: command not found
```

## ✅ Solution

### 1. Supprimer le Dockerfile du backend

Le Dockerfile dans `backend/` a été supprimé pour forcer Scallingo à utiliser Nixpacks.

### 2. Configuration Nixpacks

Un fichier `backend/nixpacks.toml` a été créé pour forcer l'utilisation de Nixpacks avec Node.js 18.

### 3. Configuration Scallingo Dashboard

**IMPORTANT** : Dans Scallingo Dashboard :

1. **Service Backend** (`wiw-ae-backend`)
   - Settings > Source
   - **Root Directory** : `backend` ✅
   - Settings > Build
   - **Builder** : `Nixpacks` ✅
   - Sauvegarder

2. **Vérifier qu'il n'y a pas de Dockerfile à la racine**
   - Si un Dockerfile existe à la racine, Scallingo peut le détecter
   - Le supprimer ou le renommer si nécessaire

### 4. Redéployer

Après configuration :
- Scallingo devrait détecter `nixpacks.toml` dans `backend/`
- Utiliser Nixpacks avec Node.js 18
- Installer npm et les dépendances correctement

## 🔍 Vérification

Dans les logs Scallingo, vous devriez voir :
```
Using Nixpacks
Node.js 18 detected
npm install...
```

Au lieu de :
```
Using Dockerfile
npm: command not found
```

## 📝 Fichiers modifiés

- ✅ `backend/nixpacks.toml` - Configuration Nixpacks
- ✅ `backend/Dockerfile` - Supprimé (causait le conflit)
- ✅ `backend/scallingo.json` - Simplifié

## 🚀 Prochaines étapes

1. **Configurer Root Directory dans Scallingo Dashboard** (si pas déjà fait)
2. **Redéployer le service backend**
3. **Vérifier les logs** - Devrait maintenant utiliser Nixpacks

