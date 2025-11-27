# 🔧 Correction du fichier .env pour développement local

## ❌ Problème identifié

Le fichier `frontend/.env` contenait :
```env
VITE_API_URL=https://wilful-roundworm-wiw-app-ca3e9be0.koyeb.app/api
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

### Pour la production

Les variables d'environnement doivent être configurées dans :
- **Railway** : Dashboard > Service > Variables
- **Vercel** : Project > Settings > Environment Variables
- **Autre plateforme** : Selon leur système de variables d'environnement

**Variables production backend :**
```env
DATABASE_URL="postgresql://user:password@host:5432/wiw_db"
JWT_SECRET="[secret-production-32+caracteres]"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://votre-domaine.com
FRONTEND_URL=https://votre-domaine.com
LOG_LEVEL=info
```

**Variables production frontend :**
```env
VITE_API_URL=https://votre-api.railway.app/api
```

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

