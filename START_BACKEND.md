# 🚀 Démarrer le backend en local

## ❌ Erreur actuelle

```
ERR_CONNECTION_REFUSED
Failed to load resource: net::ERR_CONNECTION_REFUSED
```

Cela signifie que le backend n'est pas démarré sur `http://localhost:4000`.

## ✅ Solution

### 1. Vérifier la configuration

**Créer `backend/.env` si nécessaire :**
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="votre-secret-jwt-minimum-32-caracteres-longueur-requise"
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

### 2. Installer les dépendances (si nécessaire)

```bash
cd backend
npm install
```

### 3. Générer Prisma Client

```bash
cd backend
npm run db:generate
```

### 4. Setup de la base de données (SQLite pour développement rapide)

```bash
cd backend
npm run db:push
```

### 5. Démarrer le backend

```bash
cd backend
npm run dev
```

Le backend devrait démarrer sur `http://localhost:4000`

### 6. Vérifier que le backend fonctionne

Ouvrir dans le navigateur ou avec curl :
- `http://localhost:4000/api/health`
- Devrait retourner `{ "status": "ok" }`

## 📋 Checklist

- [ ] `backend/.env` existe avec les variables requises
- [ ] Dépendances installées (`npm install`)
- [ ] Prisma Client généré (`npm run db:generate`)
- [ ] Base de données initialisée (`npm run db:push`)
- [ ] Backend démarré (`npm run dev`)
- [ ] Backend accessible sur `http://localhost:4000`
- [ ] `/api/health` retourne `{ "status": "ok" }`

## 🔍 Dépannage

### Erreur : "Cannot find module"
```bash
cd backend
npm install
```

### Erreur : "Prisma Client not generated"
```bash
cd backend
npm run db:generate
```

### Erreur : "Database connection failed"
- Vérifier `DATABASE_URL` dans `backend/.env`
- Pour SQLite : `DATABASE_URL="file:./prisma/dev.db"`
- Exécuter `npm run db:push` pour créer la base

### Erreur : "Port 4000 already in use"
- Changer le port dans `backend/.env` : `PORT=4001`
- Ou tuer le processus utilisant le port 4000

### Erreur : "JWT_SECRET too short"
Générer un secret :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🎯 Résultat attendu

Une fois le backend démarré, vous devriez voir dans le terminal :
```
✅ Serveur accessible à:
   - Local:   http://localhost:4000
   - Réseau:  http://0.0.0.0:4000

📋 Endpoints disponibles:
   - Health:  http://localhost:4000/api/health
   - Ready:   http://localhost:4000/api/ready
```

Et dans le frontend, les erreurs `ERR_CONNECTION_REFUSED` devraient disparaître.

