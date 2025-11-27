# 🔧 Dépannage Railway - Erreurs de déploiement

## ❌ Erreur : "npm: command not found" dans Dockerfile

### Problème
Railway essaie d'utiliser un Dockerfile au lieu de Nixpacks, et le Dockerfile n'a pas Node.js installé.

### Solution 1 : Configurer le Root Directory dans Railway Dashboard

1. **Aller dans Railway Dashboard**
   - Sélectionnez le service `wiw-ae-backend`
   - Allez dans **Settings** > **Source**

2. **Configurer le Root Directory**
   - **Root Directory** : `backend`
   - Sauvegarder

3. **Redéployer**
   - Railway devrait maintenant utiliser Nixpacks correctement

### Solution 2 : Vérifier qu'il n'y a pas de Dockerfile à la racine

Si un Dockerfile existe à la racine du projet, Railway peut le détecter et l'utiliser au lieu de Nixpacks.

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

**Si Railway utilise toujours le Dockerfile** :
1. Vérifier que le Root Directory est bien `backend`
2. Railway devrait utiliser le Dockerfile dans `backend/`
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

1. **Logs Railway**
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

- Documentation Railway : https://docs.railway.app
- Nixpacks : https://nixpacks.com
- Support Railway : support@railway.app

