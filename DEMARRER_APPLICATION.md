# 🚀 Démarrer l'application complète en local

## 📋 Situation actuelle

✅ **Frontend** : Fonctionne sur `http://localhost:5174/`  
❌ **Backend** : Non démarré → Erreur `ERR_CONNECTION_REFUSED` sur le port 4000

---

## 🔧 Solution : Démarrer le backend

### Étape 1 : Créer le fichier `.env` du backend

**Dans un terminal, exécutez :**

```powershell
cd backend
copy env.example .env
```

**Puis éditez `backend/.env` avec ces valeurs :**

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="changez-moi-avec-un-secret-de-32-caracteres-minimum"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV=development
HOST=0.0.0.0
CORS_ORIGIN=http://localhost:5174
FRONTEND_URL=http://localhost:5174
LOG_LEVEL=debug
```

**⚠️ Important :** Notez que `CORS_ORIGIN` et `FRONTEND_URL` doivent pointer vers le port **5174** (pas 5173) car votre frontend tourne sur ce port.

### Étape 2 : Générer un secret JWT

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiez le résultat et remplacez `JWT_SECRET` dans `backend/.env`.

### Étape 3 : Installer les dépendances (si nécessaire)

```powershell
cd backend
npm install
```

### Étape 4 : Générer Prisma Client

```powershell
npm run db:generate
```

### Étape 5 : Initialiser la base de données SQLite

```powershell
npm run db:push
```

### Étape 6 : Démarrer le backend

```powershell
npm run dev
```

---

## ✅ Vérification

### Backend démarré correctement

Vous devriez voir dans le terminal :
```
✅ Serveur accessible à:
   - Local:   http://localhost:4000
   - Réseau:  http://0.0.0.0:4000

📋 Endpoints disponibles:
   - Health:  http://localhost:4000/api/health
   - Ready:   http://localhost:4000/api/ready
```

### Tester l'API

Ouvrez dans votre navigateur :
- `http://localhost:4000/api/health`
- Devrait retourner : `{"status":"ok"}`

### Tester depuis le frontend

1. Rechargez la page frontend (`http://localhost:5174/`)
2. Cliquez sur "Connexion" dans la landing page
3. L'erreur `ERR_CONNECTION_REFUSED` devrait disparaître
4. Le formulaire de login devrait s'afficher

---

## 🔄 Script de démarrage automatique (Windows)

Créer un fichier `start-backend.bat` à la racine :

```batch
@echo off
echo Démarrage du backend...
cd backend

if not exist .env (
    echo Création du fichier .env...
    copy env.example .env
    echo ⚠️ N'oubliez pas de configurer JWT_SECRET dans backend/.env
)

echo Installation des dépendances...
call npm install

echo Génération Prisma Client...
call npm run db:generate

echo Initialisation de la base de données...
call npm run db:push

echo Démarrage du serveur backend...
call npm run dev
```

Puis double-cliquez sur `start-backend.bat`.

---

## 🐛 Dépannage

### Erreur : "Port 4000 already in use"

**Solution :**
1. Trouver le processus qui utilise le port :
   ```powershell
   netstat -ano | findstr :4000
   ```
2. Tuer le processus (remplacer PID par le numéro trouvé) :
   ```powershell
   taskkill /PID [PID] /F
   ```

### Erreur : "JWT_SECRET too short"

**Solution :** Générer un nouveau secret de 32+ caractères :
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Erreur : "Database connection failed"

**Solution :**
1. Vérifier que `DATABASE_URL` dans `.env` pointe vers SQLite :
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```
2. Réexécuter :
   ```powershell
   npm run db:push
   ```

### Erreur : "Cannot find module"

**Solution :**
```powershell
cd backend
npm install
```

---

## 📊 État final attendu

### Terminal 1 : Frontend
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5174/
➜  Network: use --host to expose
```

### Terminal 2 : Backend
```
✅ Serveur accessible à:
   - Local:   http://localhost:4000
   - Réseau:  http://0.0.0.0:4000

📋 Endpoints disponibles:
   - Health:  http://localhost:4000/api/health
```

### Navigateur
- Landing page : `http://localhost:5174/`
- Login : `http://localhost:5174/login`
- Pas d'erreurs CORS dans la console
- Pas d'erreurs `ERR_CONNECTION_REFUSED`

---

## 🎯 Prochaines étapes

Une fois le backend démarré :

1. ✅ La landing page fonctionne
2. ✅ Le bouton "Connexion" ouvre le formulaire de login
3. ✅ Le login peut se connecter à l'API
4. ✅ Après connexion, redirection vers `/dashboard`

