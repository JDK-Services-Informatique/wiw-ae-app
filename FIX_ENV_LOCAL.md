# 🔧 Correction du fichier .env pour développement local

## ❌ Problème identifié

Le fichier `frontend/.env` contenait une URL Railway (ou autre plateforme distante) :
```env
VITE_API_URL=https://xxx.up.railway.app/api
# ou
VITE_API_URL=https://xxx.koyeb.app/api
```

**Conséquences :**
- ❌ Le frontend en développement (`http://localhost:5173`) tente de se connecter à une API distante
- ❌ Erreurs CORS : `Access-Control-Allow-Origin` manquant
- ❌ `ERR_CONNECTION_REFUSED` si le backend local n'est pas démarré
- ❌ Impossibilité de développer localement

## ✅ Solution appliquée

Le fichier `frontend/.env` a été corrigé pour pointer vers l'API locale :
```env
VITE_API_URL=http://localhost:4000/api
```

## 📋 Configuration recommandée

### Pour le développement local

**`frontend/.env` :**
```env
VITE_API_URL=http://localhost:4000/api
```

**`backend/.env` :**
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

### Pour la production sur Railway

**⚠️ IMPORTANT :** Les variables d'environnement pour Railway sont configurées dans le **Railway Dashboard**, pas dans les fichiers `.env` locaux.

#### Configuration dans Railway Dashboard

**Backend Service (Railway Dashboard > Service Backend > Variables) :**
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=[secret-production-32+caracteres]
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://votre-frontend.up.railway.app
CORS_ORIGIN=https://votre-frontend.up.railway.app
LOG_LEVEL=info
```
- `DATABASE_URL` est automatiquement injectée depuis la base de données PostgreSQL Railway

**Frontend Service (Railway Dashboard > Service Frontend > Variables) :**
```env
VITE_API_URL=https://votre-backend.up.railway.app/api
NODE_ENV=production
```

#### Comment trouver les URLs Railway

1. **Backend URL :**
   - Railway Dashboard > Service Backend > Settings > Networking
   - Cliquez sur "Generate Domain" si pas encore fait
   - URL du type : `https://wiw-ae-backend.up.railway.app`
   - API : `https://wiw-ae-backend.up.railway.app/api`

2. **Frontend URL :**
   - Railway Dashboard > Service Frontend > Settings > Networking
   - Cliquez sur "Generate Domain" si pas encore fait
   - URL du type : `https://wiw-ae-frontend.up.railway.app`

#### Ordre de configuration recommandé

1. Déployer le backend → Noter l'URL backend
2. Déployer le frontend avec `VITE_API_URL` pointant vers l'URL backend → Noter l'URL frontend
3. Mettre à jour le backend avec `FRONTEND_URL` et `CORS_ORIGIN` pointant vers l'URL frontend
4. Le backend redémarre automatiquement avec la bonne configuration CORS

## 🔄 Redémarrer le serveur de développement

**IMPORTANT :** Après modification de `.env`, il faut **redémarrer complètement** le serveur Vite :

1. Arrêter le serveur frontend (Ctrl+C)
2. Redémarrer : `npm run dev`

Les variables `.env` ne sont chargées qu'au démarrage du serveur.

## ✅ Vérification

Après correction et redémarrage, dans la console du navigateur (F12), les requêtes doivent pointer vers :
```
http://localhost:4000/api/...
```

Et les erreurs CORS doivent disparaître.

## 📝 Note

Le fichier `frontend/src/config.js` contient une logique de fallback qui détecte automatiquement les URLs distantes en développement et force localhost. Cependant, il est préférable d'avoir la bonne valeur dans `.env` dès le départ.

