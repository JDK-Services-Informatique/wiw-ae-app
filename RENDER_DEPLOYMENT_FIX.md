# 🔧 Correction du déploiement Render - Frontend échoué

## ❌ Problème identifié

Lors du déploiement via Blueprint, le frontend n'a pas pu être créé :
```
Create static site wiw-ae-frontend-zt2a
(canceled: another action failed)
```

**Cause** : Dépendance circulaire entre le backend et le frontend. Le backend essaie de référencer le frontend (pour `FRONTEND_URL` et `CORS_ORIGIN`) avant que le frontend ne soit créé.

## ✅ Solution

### Option 1 : Déploiement en deux étapes (Recommandé)

#### Étape 1 : Créer le frontend d'abord

1. **Créer le frontend manuellement** :
   - Render Dashboard > "New" > "Static Site"
   - Repository : `JDK-Services-Informatique/wiw-ae-app`
   - Branch : `main`
   - Root Directory : `frontend`
   - Build Command : `npm install && npm run build`
   - Publish Directory : `dist`
   - Environment Variables :
     ```
     VITE_API_URL=https://wiw-ae-backend-zt2a.onrender.com
     ```
   - Routes (SPA) :
     - Source : `/*`
     - Destination : `/index.html`
     - Type : Rewrite

2. **Attendre que le frontend soit "Live"**

#### Étape 2 : Mettre à jour le backend

1. **Aller dans le service backend** : `wiw-ae-backend-zt2a`
2. **Environment Variables** :
   - Ajouter/Modifier :
     ```
     FRONTEND_URL=https://wiw-ae-frontend-zt2a.onrender.com
     CORS_ORIGIN=https://wiw-ae-frontend-zt2a.onrender.com
     ```
3. **Redeployer le backend** si nécessaire

### Option 2 : Modifier render.yaml pour éviter la dépendance

Modifier `render.yaml` pour que le backend n'ait pas de dépendance sur le frontend au moment de la création :

```yaml
# Backend - Variables d'environnement sans dépendance initiale
envVars:
  - key: FRONTEND_URL
    value: ""  # À mettre à jour manuellement après création du frontend
  - key: CORS_ORIGIN
    value: ""  # À mettre à jour manuellement après création du frontend
```

Puis mettre à jour ces variables après que le frontend soit créé.

### Option 3 : Utiliser des valeurs temporaires

1. **Modifier render.yaml** pour utiliser des valeurs temporaires :
   ```yaml
   - key: FRONTEND_URL
     value: "https://placeholder.onrender.com"
   - key: CORS_ORIGIN
     value: "https://placeholder.onrender.com"
   ```

2. **Déployer via Blueprint**

3. **Mettre à jour les variables** avec les vraies valeurs après création du frontend

## 🔍 Vérification

Après correction :

1. **Vérifier que tous les services sont "Live"** :
   - ✅ `wiw-ae-db-zt2a` (Database)
   - ✅ `wiw-ae-backend-zt2a` (Web Service)
   - ✅ `wiw-ae-frontend-zt2a` (Static Site)

2. **Vérifier les variables d'environnement** :
   - Backend : `FRONTEND_URL` et `CORS_ORIGIN` pointent vers le frontend
   - Frontend : `VITE_API_URL` pointe vers le backend

3. **Tester les URLs** :
   - Frontend : `https://wiw-ae-frontend-zt2a.onrender.com`
   - Backend : `https://wiw-ae-backend-zt2a.onrender.com/api/health`

## 📝 Notes

- Le problème vient de la dépendance circulaire dans le Blueprint
- Render crée les services dans un ordre qui peut causer des problèmes avec les références `fromService`
- La solution manuelle en deux étapes est la plus fiable

